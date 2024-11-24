import { networkInterfaces } from "os";


export const getNetworkAddress = () => {
    for (const networkInterface of Object.values(networkInterfaces())) {
        if (!networkInterface) continue;
        for (const details of networkInterface) {
            const { address, family, internal } = details;
            if (family === "IPv4" && !internal) return address;
        }
    }
};
