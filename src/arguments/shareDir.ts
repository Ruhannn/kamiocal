export const sharedDir = process.argv[2];
if (!sharedDir) {
    console.error("Please provide the directory path.");
    process.exit(1);
}