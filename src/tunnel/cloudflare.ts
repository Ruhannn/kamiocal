import { spawn } from "child_process";

export interface CloudflareTunnelOptions {
    port: number;
    onUrl: (url: string) => void;
    onError: (message: string) => void;
}

export interface CloudflareTunnelProcess {
    stop: () => void;
}

const tunnelUrlPattern = /https:\/\/[-a-z0-9]+\.trycloudflare\.com/iu;

export const startCloudflareTunnel = ({ port, onUrl, onError }: CloudflareTunnelOptions): CloudflareTunnelProcess => {
    const tunnelProcess = spawn(
        "cloudflared",
        ["tunnel", "--no-autoupdate", "--url", `http://127.0.0.1:${port}`],
        { stdio: ["ignore", "pipe", "pipe"] },
    );
    let reportedUrl = false;
    let reportedSpawnError = false;
    let bufferedOutput = "";

    const inspectOutput = (chunk: Buffer) => {
        if (reportedUrl) return;

        bufferedOutput = `${bufferedOutput}${chunk.toString("utf8")}`.slice(-4096);
        const match = bufferedOutput.match(tunnelUrlPattern);

        if (!match?.[0]) return;

        reportedUrl = true;
        onUrl(match[0]);
    };

    tunnelProcess.stdout.on("data", inspectOutput);
    tunnelProcess.stderr.on("data", inspectOutput);
    tunnelProcess.on("error", (error: NodeJS.ErrnoException) => {
        reportedSpawnError = true;

        if (error.code === "ENOENT") {
            onError("Cloudflare tunnel needs the cloudflared command. Install it from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/ and run with --tunnel again.");
            return;
        }

        onError(`Cloudflare tunnel failed: ${error.message}`);
    });
    tunnelProcess.on("exit", (code) => {
        if (!reportedSpawnError && code && !reportedUrl) {
            onError(`Cloudflare tunnel exited before creating a URL (exit code ${code}).`);
        }
    });

    return {
        stop: () => {
            if (!tunnelProcess.killed) tunnelProcess.kill("SIGTERM");
        },
    };
};
