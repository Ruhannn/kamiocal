import path from "path"
import { sharedDir } from "../arguments/shareDir"

export const getFilePath = (file: string) => {
    return path.join(sharedDir, file)
}