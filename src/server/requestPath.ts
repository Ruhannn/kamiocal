import { resolve, sep } from "path";

export interface ResolvedRequestPath {
    filePath: string;
    requestPath: string;
}

export const resolveRequestPath = (rootPath: string, requestPath: string): ResolvedRequestPath | null => {
    let decodedPath: string;

    try {
        decodedPath = decodeURIComponent(requestPath);
    } catch {
        return null;
    }

    if (decodedPath.includes("\0")) return null;

    const root = resolve(rootPath);
    const filePath = resolve(root, `.${decodedPath}`);
    const isInsideRoot = filePath === root || filePath.startsWith(`${root}${sep}`);

    if (!isInsideRoot) return null;

    return { filePath, requestPath: decodedPath || "/" };
};
