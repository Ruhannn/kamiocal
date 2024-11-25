import { stat } from "fs";


export const sharedDir = process.argv[2]!;

if (!sharedDir) {
    console.error(" Oopsie! You forgot to tell me which directory to look at. Please provide the directory path!");
    process.exit(1);
}

stat(sharedDir, (err, stats) => {
    if (err) {
        console.error(` Oh no! Something went wrong... 😔`);
        process.exit(1);
    }

    if (!stats.isDirectory()) {
        console.error(` Uh-oh, this isn't a directory :C, The path you gave me, "${sharedDir}", is something else. Please give me a valid directory!`);
        process.exit(1);
    }
});

