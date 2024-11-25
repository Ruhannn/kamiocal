import { join } from "path";
import { Router } from 'express';
import { sharedDir } from "../arguments/shareDir";
import { readDirectory } from "../utils/files"; // Ensure this function returns data correctly
import app from "../app"; // Assuming app is correctly set up

const router = Router();

router.get('/', (req, res) => {
    try {
        const data = readDirectory(sharedDir); // This should return data to be passed to the view
        res.render('index', { data }); // Render the 'index' view with the data
    } catch (error) {
        res.status(500).send("Error reading directory");
    }
});

router.get('/:folder/*', (req, res) => {  // Use * to capture all remaining path segments
    const folderPath = join(sharedDir, req.params.folder!);
    try {
        const data = readDirectory(folderPath); // Get data from the folder path
        res.render('index', { data }); // Render the 'index' view with the data
    } catch (error) {
        res.status(500).send("Error reading folder");
    }
});

export default router;
