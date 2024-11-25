import { humanFileSize } from './humanFileSize';
import { readdirSync } from "fs";
import { FileDetails } from "../@types";
import { getFilePath } from "./getFilePath";
import { getFolderStats, getStats } from './getStats';
import { getFileExtension } from './getFileExtension';


export const readDirectory = (sharedDir: string): FileDetails[] => {
    return readdirSync(sharedDir).map((file) => {
        const filePath = getFilePath(sharedDir, file)
        const stats = getStats(filePath)
        const isDir = stats.isDirectory()
        if (isDir) {
            const folderStats = getFolderStats(filePath);
            if (folderStats.numFiles === 0) {
                return null;
            }
        }

        return {
            name: file,
            path: file,
            fullPath: filePath,
            isDirectory: isDir,
            type: isDir ? "folder" : getFileExtension(filePath),
            size: isDir ? humanFileSize(getFolderStats(filePath).totalSize) : humanFileSize(stats.size),
            totalFiles: isDir ? getFolderStats(filePath).numFiles : null
        }
    }).filter(file => file !== null).sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) {
            return -1;
        } else if (!a.isDirectory && b.isDirectory) {
            return 1;
        }
        return 0;
    });
}