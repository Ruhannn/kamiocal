import { readdirSync, statSync } from "fs";
import type { Dirent } from "fs";
import { extname, join, posix } from "path";
import { FileDetails } from "../types";

interface FolderStats {
    numFiles: number;
    totalSize: number;
}

const units = ["B", "kB", "MB", "GB", "TB"];
const emptyFolderStats: FolderStats = {
    numFiles: 0,
    totalSize: 0,
};

const formatFileSize = (size: number) => {
    if (size <= 0) return "0 B";

    const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
    const value = Number((size / Math.pow(1024, unitIndex)).toFixed(2));

    return `${value} ${units[unitIndex]}`;
};

const readFolderStats = (folderPath: string): FolderStats => {
    let numFiles = 0;
    let totalSize = 0;

    try {
        for (const entry of readdirSync(folderPath, { withFileTypes: true })) {
            if (!entry.isFile()) continue;

            try {
                totalSize += statSync(join(folderPath, entry.name)).size;
                numFiles++;
            } catch {
                // Entry changed between readdir and stat. Skip it.
            }
        }
    } catch {
        return emptyFolderStats;
    }

    return { numFiles, totalSize };
};

const readFileDetails = (sharedDir: string, basePath: string, entry: Dirent): FileDetails | null => {
    if (!entry.isFile() && !entry.isDirectory()) return null;

    const filePath = join(sharedDir, entry.name);
    const href = posix.join(basePath, encodeURIComponent(entry.name));

    if (entry.isDirectory()) {
        const folderStats = readFolderStats(filePath);

        return {
            name: entry.name,
            path: href,
            href: `${href}/`,
            fullPath: filePath,
            isDirectory: true,
            type: "folder",
            size: formatFileSize(folderStats.totalSize),
            totalFiles: folderStats.numFiles,
        };
    }

    try {
        const stats = statSync(filePath);

        return {
            name: entry.name,
            path: href,
            href,
            fullPath: filePath,
            isDirectory: false,
            type: extname(filePath).toLowerCase().replace(".", ""),
            size: formatFileSize(stats.size),
            totalFiles: null,
        };
    } catch {
        return null;
    }
};

export const readDirectory = (sharedDir: string, requestPath = "/"): FileDetails[] => {
    const basePath = requestPath.endsWith("/") ? requestPath : `${requestPath}/`;
    const files: FileDetails[] = [];

    for (const entry of readdirSync(sharedDir, { withFileTypes: true })) {
        const file = readFileDetails(sharedDir, basePath, entry);

        if (file) files.push(file);
    }

    return files.sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
};
