import { humanFileSize } from './humanFileSize';
import { readdirSync } from "fs";
import { FileDetails } from "../@types";
import { getFilePath } from "./getFilePath";
import { getFolderStats, getStats } from './getStats';


export const readDirectory = (sharedDir: string): FileDetails[] => {
    return readdirSync(sharedDir).map((file) => {
        const filePath = getFilePath(file)
        const stats = getStats(filePath)
        const isDir = stats.isDirectory()
        console.log();

        return {
            name: file,
            path: filePath,
            isDirectory: isDir,
            size: isDir ? humanFileSize(getFolderStats(filePath).totalSize) : humanFileSize(stats.size),
            totalFiles: isDir ? getFolderStats(filePath).numFiles : null
        }
    });
}