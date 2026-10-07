import figlet from "figlet";
import qrcode from "qrcode-terminal";
import { networkInterfaces } from "os";

export interface ScreenOptions {
    sharedDir: string;
    port: number;
    showQr: boolean;
}

const getNetworkAddress = () => {
    for (const networkInterface of Object.values(networkInterfaces())) {
        if (!networkInterface) continue;

        for (const details of networkInterface) {
            if (details.family === "IPv4" && !details.internal) return details.address;
        }
    }
};

export const bigText = (inputText: string) => {
    figlet(inputText, (err, data) => {
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }

        console.log(data);
    });
};

export const printQrCode = (url: string) => {
    qrcode.generate(url, { small: true }, (q) => {
        const qrCode = q
            .split("\n")
            .map((line) => ` ${line}`)
            .join("\n");

        console.log(`\n${qrCode}`);
    });
};

export const screen = ({ sharedDir, port, showQr }: ScreenOptions) => {
    const url = `http://${getNetworkAddress() ?? "localhost"}:${port}`;

    console.log(`\x1b[1m\x1b[33m Welcome to KamioCal!\n\n Sharing '${sharedDir}' here: \x1b[0m`);

    if (showQr) {
        console.log(" \x1b[1m\x1b[33mScan the QR code to open it on your local network.\x1b[0m");
        printQrCode(url);
    }

    console.log(`\n\n Local URL: ${url}\n Press ctrl+c to stop sharing`);
};

export const printTunnelUrl = (url: string) => {
    console.log(`\n Cloudflare URL: ${url}`);
    printQrCode(url);
};
