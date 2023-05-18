import express from 'express';
import path from "path";
import * as dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.middleware';
import notFoundHandler from './middlewares/notFoundHandler.middleware';
import { connectToDatabase } from './database/database';
import authRouter from './routes/auth.router';
import playersRouter from './routes/players.router';
import sportsCategoriesRouter from './routes/sportsCategories.router';
import tournamentsRouter from './routes/tournaments.router';
import gamesRouter from './routes/games.router';
import playerStatsRouter from './routes/playerStats.router';
import { splitArrayByItemsCount, splitArrayBySubArraysCount } from './utils/math';
import cors from 'cors';

dotenv.config({path: `${__dirname}/../.env`});

const PORT = process.env.PORT || 5000;
const URI = process.env.URI || 'http://localhost';
const app = express();


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.resolve('../client')))
app.use(cors());

app.get('/', (request, response) => {
    response.sendFile(path.resolve('../client/index.html'));
})




app.use('/api/auth', authRouter);
app.use('/api/players', playersRouter);
app.use('/api/sports-categories', sportsCategoriesRouter);
app.use('/api/tournaments', tournamentsRouter);
app.use('/api/games', gamesRouter);
app.use('/api/player-stats', playerStatsRouter);

app.use(notFoundHandler);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу ${URI}:${PORT}`);
    
    connectToDatabase();
});

/* bcrypt.hash("admin123", 10)
.then(hash => console.log(hash)); */