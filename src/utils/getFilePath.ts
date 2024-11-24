import { join } from "path"

export const getFilePath = (sharedDir: string, file: string) => {
    return join(sharedDir, file)
}