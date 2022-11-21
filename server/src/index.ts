import express from 'express';
import path from "path";
import * as dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.middleware';
import notFoundHandler from './middlewares/notFoundHandler.middleware';
import { connectToDatabase } from './database/database';
import authRouter from './routes/auth.router';
import playersRouter from './routes/players.router';
import sportsCategoriesRouter from './routes/sportsCategories.router';

dotenv.config({path: `${__dirname}/../.env`});

const PORT = process.env.PORT || 5000;
const URI = process.env.URI || 'http://localhost';
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.resolve('../client')))

app.get('/', (request, response) => {
    response.sendFile(path.resolve('../client/index.html'));
})




app.use('/auth', authRouter);
app.use('/players', playersRouter);
app.use('/sports-categories', sportsCategoriesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу ${URI}:${PORT}`);
    connectToDatabase();
});

/* bcrypt.hash("admin123", 10)
.then(hash => console.log(hash)); */