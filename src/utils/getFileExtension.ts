import { extname } from "path";

export const getFileExtension = (filePath: string) => {
    return extname(filePath).toLowerCase()
}; 