export interface FileDetails {
    name: string;
    path: string;
    fullPath: string
    isDirectory: boolean;
    size: string;
    totalFiles: number | null
    type: string
}
