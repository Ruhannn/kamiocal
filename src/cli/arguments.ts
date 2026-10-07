import { existsSync, statSync } from "fs";
import { homedir } from "os";
import { resolve } from "path";

export interface CliOptions {
    sharedDir: string;
    port: number;
    tunnel: boolean;
    help: boolean;
}

export class CliArgumentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CliArgumentError";
    }
}

const defaultPort = 7879;

const expandHome = (value: string) => {
    if (value === "~") return homedir();
    if (value.startsWith("~/")) return resolve(homedir(), value.slice(2));
    return value;
};

const readPort = (value: string | undefined) => {
    const port = Number(value);

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new CliArgumentError(`Invalid port "${value}". Use a number from 1 to 65535.`);
    }

    return port;
};

const resolveSharedDir = (input = ".") => {
    const sharedDir = resolve(expandHome(input));

    if (!existsSync(sharedDir)) {
        throw new CliArgumentError(`Directory does not exist: ${sharedDir}`);
    }

    if (!statSync(sharedDir).isDirectory()) {
        throw new CliArgumentError(`Path is not a directory: ${sharedDir}`);
    }

    return sharedDir;
};

export const parseArguments = (argv = process.argv.slice(2), env: NodeJS.ProcessEnv = process.env): CliOptions => {
    let tunnel = false;
    let help = false;
    let port = readPort(env.PORT ?? String(defaultPort));
    let directory: string | undefined;

    for (let index = 0; index < argv.length; index++) {
        const arg = argv[index];

        if (!arg) continue;

        if (arg === "--") {
            const remaining = argv.slice(index + 1);

            if (remaining.length > 1) throw new CliArgumentError("Only one directory path can be shared at a time.");

            directory = remaining[0] ?? directory;
            break;
        }

        if (arg === "--help" || arg === "-h") {
            help = true;
            continue;
        }

        if (arg === "--tunnel" || arg === "--cloudflare" || arg === "--cf") {
            tunnel = true;
            continue;
        }

        if (arg === "--port" || arg === "-p") {
            index++;
            port = readPort(argv[index]);
            continue;
        }

        if (arg.startsWith("--port=")) {
            port = readPort(arg.slice("--port=".length));
            continue;
        }

        if (arg.startsWith("-")) {
            throw new CliArgumentError(`Unknown option: ${arg}`);
        }

        if (directory) {
            throw new CliArgumentError("Only one directory path can be shared at a time.");
        }

        directory = arg;
    }

    return {
        sharedDir: help ? resolve(expandHome(directory ?? ".")) : resolveSharedDir(directory),
        port,
        tunnel,
        help,
    };
};

export const usage = `Usage: kamiocal [directory] [options]

Directory defaults to the current working directory. Use "." explicitly for the current directory.

Options:
  --tunnel, --cloudflare, --cf   Start a Cloudflare quick tunnel with cloudflared
  -p, --port <port>              Port to listen on (default: ${defaultPort}, or PORT env)
  -h, --help                     Show this help message`;
