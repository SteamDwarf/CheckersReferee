import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config({path: `${__dirname}/../.env`});

const PORT = process.env.PORT || 5000;
const URI = process.env.URI || 'http://localhost';
const app = express();

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу ${URI}:${PORT}`);
});