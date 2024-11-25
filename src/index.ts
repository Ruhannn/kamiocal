#!/usr/bin/env node
import { bigText, PORT, screen } from './utils/text';
import app from "./app";




bigText("K a m i o c a l")


const server = app.listen(PORT, () => {
    screen()
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log(" Server has been gently put to rest. Goodbye!");
        process.exit(0);
    });
});

