import * as dotenv from 'dotenv';

import App from './App';
import AuthController from './auth/Auth.controller';
import AuthMiddleware from './auth/Auth.middleware';
import AuthService from './auth/Auth.service';
import SportsCategoryService from './sportsCategory/SportsCategory.service';
import SportsCategoryController from './sportsCategory/SportsCategory.controller';
import PlayerService from './players/Player.service';
import PlayerController from './players/Player.controller';
import ErrorHandler from './errors/ErrorHandler.middleware';
import PlayerStatsService from './playerStats/PlayerStats.service';
import PlayerStatsController from './playerStats/PlayerStats.controller';
import DataBase from './DB/DataBase';
import TournamentMiddleware from './tournaments/Tournament.middleware';
import TournamentService from './tournaments/Tournament.service';
import TournamentController from './tournaments/Tournament.controller';
import GameService from './games/Game.service';
import GameController from './games/Game.controller';

dotenv.config({path: `${__dirname}/../.env`});

const PORT = process.env.PORT || '5000';
const URI = process.env.URI || 'http://localhost';
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

const database = new DataBase(MONGO_URI);

const authMiddleware = new AuthMiddleware();
const authService = new AuthService(database);
const authController = new AuthController(authMiddleware, authService);

const sportsCategoryService = new SportsCategoryService(database);
const sportsCategoryController = new SportsCategoryController(sportsCategoryService);

const playerService = new PlayerService(database, sportsCategoryService);
const playerController = new PlayerController(playerService);

const playerStatsService = new PlayerStatsService(database);
const playerStatsController = new PlayerStatsController(playerStatsService);

const gameService = new GameService(database);
const gameController = new GameController(gameService);

const tournamentService = new TournamentService(database, playerService, playerStatsService, gameService);
const tournamentMiddleware = new TournamentMiddleware(tournamentService);
const tournamentController = new TournamentController(tournamentMiddleware, tournamentService);



const errorHandler = new ErrorHandler();

const app = new App(
    PORT, 
    URI, 
    database,
    authController, 
    sportsCategoryController,
    playerController,
    playerStatsController,
    tournamentController,
    gameController,
    errorHandler
);

app.start();

