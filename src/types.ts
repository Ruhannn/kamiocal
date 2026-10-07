export interface FileDetails {
    name: string;
    path: string;
    href: string;
    fullPath: string;
    isDirectory: boolean;
    size: string;
    totalFiles: number | null;
    type: string;
}
