import express from 'express';
import { sharedDir } from './arguments/shareDir';
import router from './routes';


const app = express();



app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static('./public'))

app.use(express.static(sharedDir));

app.use(router)


export default app