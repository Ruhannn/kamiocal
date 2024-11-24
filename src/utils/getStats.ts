import { readdirSync, statSync } from "fs";
import { join } from "path";

export const getStats = (filePath: string) => { return statSync(filePath) }

export const getFolderStats = (folderPath: string): { numFiles: number; totalSize: number } => {
    const folderFiles = readdirSync(folderPath);
    let numFiles = 0;
    let totalSize = 0;

    for (const file of folderFiles) {
        const filePath = join(folderPath, file);
        const stats = statSync(filePath);

        if (stats.isFile()) {
            numFiles++;
            totalSize += stats.size;
        }
    }
    return { numFiles, totalSize };
}
