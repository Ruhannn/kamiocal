import { join } from "path";
import app from "../app";
import { sharedDir } from "../arguments/shareDir";
import { readDirectory } from "../utils/files";

import { Router } from 'express';

const router = Router();


router.get('/', (req, res) => {
    const data = readDirectory(sharedDir)
    res.render('index', { data });
});

router.get('/:folder/(*)', (req, res) => {
    const folderPath = join(sharedDir, req.params.folder!);
    const data = readDirectory(folderPath)
    res.render('index', { data });

});

export default router;
