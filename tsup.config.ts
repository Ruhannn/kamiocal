import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'dist',
    clean: true,
    format: ['cjs'],
    onSuccess: 'cp -r src/views dist && cp -r public dist/public',
});