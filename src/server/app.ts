import { Hono } from "hono";
import type { Context } from "hono";
import ejs from "ejs";
import { readFileSync, statSync } from "fs";
import { join } from "path";
import { readDirectory } from "./directoryListing";
import { publicAssetCache, serveFile, sharedFileCache } from "./fileResponse";
import { resolveRequestPath } from "./requestPath";

export interface AppOptions {
    sharedDir: string;
    publicDir?: string;
    viewsDir?: string;
}

export const createApp = ({
    sharedDir,
    publicDir = join(__dirname, "public"),
    viewsDir = join(__dirname, "views"),
}: AppOptions) => {
    const app = new Hono();
    const indexView = join(viewsDir, "index.ejs");
    let renderIndex: ejs.TemplateFunction | undefined;

    const renderDirectory = (filePath: string, requestPath: string) => {
        if (!renderIndex) {
            renderIndex = ejs.compile(readFileSync(indexView, "utf8"), { filename: indexView, cache: false });
        }

        return renderIndex({ data: readDirectory(filePath, requestPath) });
    };

    const publicAssetHandler = (c: Context) => {
        const resolvedPath = resolveRequestPath(publicDir, c.req.path);

        if (!resolvedPath) return c.text("Not found", 404);

        try {
            const stats = statSync(resolvedPath.filePath);

            if (!stats.isFile()) return c.text("Not found", 404);

            return serveFile(c, resolvedPath.filePath, stats, publicAssetCache);
        } catch {
            return c.text("Not found", 404);
        }
    };

    const sharedPathHandler = (c: Context) => {
        const resolvedPath = resolveRequestPath(sharedDir, c.req.path);

        if (!resolvedPath) return c.text("Not found", 404);

        try {
            const stats = statSync(resolvedPath.filePath);

            if (stats.isFile()) return serveFile(c, resolvedPath.filePath, stats, sharedFileCache);
            if (!stats.isDirectory()) return c.text("Not found", 404);

            c.header("Cache-Control", "no-store");
            return c.html(renderDirectory(resolvedPath.filePath, resolvedPath.requestPath));
        } catch {
            return c.text("Not found", 404);
        }
    };

    app.get("/styles/*", publicAssetHandler);
    app.on("HEAD", "/styles/*", publicAssetHandler);
    app.get("/icons/*", publicAssetHandler);
    app.on("HEAD", "/icons/*", publicAssetHandler);
    app.get("*", sharedPathHandler);
    app.on("HEAD", "*", sharedPathHandler);

    return app;
};
