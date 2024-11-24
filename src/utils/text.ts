import qrcode from 'qrcode-terminal';
import figlet from "figlet";
import { getNetworkAddress } from "./getNetworkAddress";
import { sharedDir } from "../arguments/shareDir";

export const PORT = process.env.PORT || 7879;


export const bigText = (inputText: string) => {
    figlet(inputText, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }

        console.log(data);
    });
}


export const screen = () => {
    const url = `http://${getNetworkAddress() ?? "localhost"}:${PORT}`;

    console.log(`\x1b[1m\x1b[33m Welcome to KamioCal!\n\n Access '${sharedDir}' in here: 🐾 \x1b[0m`);
    console.log(' \x1b[1m\x1b[33mScan the QR code to get started!\x1b[0m');
    qrcode.generate(url, { small: true }, (q) => {
        const QrCode = q
            .split('\n')
            .map(line => " " + line)
            .join('\n');

        console.log(`\n${QrCode}`);
    });

    console.log(
        `\n\n or visit this magical link: ${url}\n\n Press ctrl+c to stop sharing`
    );
};

