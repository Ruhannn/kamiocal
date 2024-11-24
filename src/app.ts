import express from 'express';
import { sharedDir } from './arguments/shareDir';
import router from './routes';


const app = express();



app.set('views', './src/views');
app.set('view engine', 'pug');
app.use(express.static('./public'))

app.use(express.static(sharedDir));

app.use(router)


export default app