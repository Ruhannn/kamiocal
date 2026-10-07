import type { Context } from "hono";
import { getMimeType } from "hono/utils/mime";
import { createReadStream, type Stats } from "fs";
import { Readable } from "stream";

interface ByteRange {
    start: number;
    end: number;
}

export const publicAssetCache = "public, max-age=31536000, immutable";
export const sharedFileCache = "public, max-age=0, must-revalidate";

const parseByteRange = (rangeHeader: string | undefined, size: number): ByteRange | null => {
    if (!rangeHeader) return { start: 0, end: size - 1 };

    const match = rangeHeader.match(/^bytes=(\d*)-(\d*)$/);

    if (!match) return null;

    const rawStart = match[1] ?? "";
    const rawEnd = match[2] ?? "";

    if (!rawStart && !rawEnd) return null;

    if (!rawStart) {
        const suffixLength = Number(rawEnd);

        if (!Number.isInteger(suffixLength) || suffixLength <= 0) return null;

        return {
            start: Math.max(size - suffixLength, 0),
            end: size - 1,
        };
    }

    const start = Number(rawStart);
    const end = rawEnd ? Number(rawEnd) : size - 1;

    if (!Number.isInteger(start) || !Number.isInteger(end) || start > end || start >= size) return null;

    return { start, end: Math.min(end, size - 1) };
};

export const serveFile = (c: Context, filePath: string, stats: Stats, cacheControl: string) => {
    const etag = `W/"${stats.size.toString(16)}-${Math.trunc(stats.mtimeMs).toString(16)}"`;
    const ifModifiedSince = c.req.header("if-modified-since");

    c.header("Accept-Ranges", "bytes");
    c.header("Cache-Control", cacheControl);
    c.header("Content-Type", getMimeType(filePath) ?? "application/octet-stream");
    c.header("ETag", etag);
    c.header("Last-Modified", stats.mtime.toUTCString());

    if (c.req.header("if-none-match") === etag) return c.body(null, 304);

    if (ifModifiedSince && Date.parse(ifModifiedSince) >= stats.mtime.getTime()) {
        return c.body(null, 304);
    }

    if (stats.size === 0) {
        c.header("Content-Length", "0");
        return c.body(null, 200);
    }

    const range = parseByteRange(c.req.header("range"), stats.size);

    if (!range) {
        c.header("Content-Range", `bytes */${stats.size}`);
        return c.body(null, 416);
    }

    const contentLength = range.end - range.start + 1;
    const status = contentLength === stats.size ? 200 : 206;

    c.header("Content-Length", String(contentLength));

    if (status === 206) c.header("Content-Range", `bytes ${range.start}-${range.end}/${stats.size}`);
    if (c.req.method === "HEAD") return c.body(null, status);

    const stream = Readable.toWeb(createReadStream(filePath, { start: range.start, end: range.end }));

    return c.body(stream as ReadableStream, status);
};
