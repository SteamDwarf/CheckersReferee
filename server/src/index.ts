import express from 'express';
import * as dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.middleware';
import notFoundHandler from './middlewares/notFoundHandler.middleware';
import { connectToDatabase } from './database/database';
import { handleAuth } from './controllers/auth.controller';
import bcrypt from "bcrypt";

dotenv.config({path: `${__dirname}/../.env`});

const PORT = process.env.PORT || 5000;
const URI = process.env.URI || 'http://localhost';
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/auth', handleAuth);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу ${URI}:${PORT}`);
    connectToDatabase();
});

/* bcrypt.hash("admin123", 10)
.then(hash => console.log(hash)); */