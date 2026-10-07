import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    clean: true,
    format: ["cjs"],
    onSuccess: "rm -rf dist/views dist/public && cp -r src/views dist/views && mkdir -p dist/public && cp -r public/. dist/public",
});