import express from 'express';
import { sharedDir } from './arguments/shareDir';
import router from './routes';
import { noCacheMiddleware } from './middleware';
import path from 'path';


const app = express();



app.use(noCacheMiddleware);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view cache', false);
app.use(express.static('./public'))

app.use(express.static(sharedDir));

app.use(router)

export default app