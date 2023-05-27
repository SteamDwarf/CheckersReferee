import "reflect-metadata";

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
import { Container } from "inversify";
import { CONTROLLERS, MAIN, MIDDLEWARES, SERVICES } from "./common/injectables.types";

dotenv.config({path: `${__dirname}/../.env`});

const PORT = process.env.PORT || '5000';
const URI = process.env.URI || 'http://localhost';
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

/* const database = new DataBase(MONGO_URI);

const authMiddleware = new AuthMiddleware();
const authService = new AuthService(database);
const authController = new AuthController(authMiddleware, authService);

const sportsCategoryService = new SportsCategoryService(database);
const sportsCategoryController = new SportsCategoryController(sportsCategoryService);

const playerService = new PlayerService(database, sportsCategoryService);
const playerController = new PlayerController(playerService);

const playerStatsService = new PlayerStatsService(database, sportsCategoryService);
const playerStatsController = new PlayerStatsController(playerStatsService);

const gameService = new GameService(database, playerStatsService);
const gameController = new GameController(gameService);

const tournamentService = new TournamentService(database, playerService, playerStatsService, gameService);
const tournamentMiddleware = new TournamentMiddleware(tournamentService);
const tournamentController = new TournamentController(tournamentMiddleware, tournamentService); */

//const errorHandler = new ErrorHandler();

const container = new Container();

container.bind<string>(MAIN.AppURI).toConstantValue(URI);
container.bind<string>(MAIN.AppPort).toConstantValue(PORT);
container.bind<string>(MAIN.DatabaseURI).toConstantValue(MONGO_URI);
container.bind<DataBase>(MAIN.Database).to(DataBase).inSingletonScope();
container.bind<App>(MAIN.App).to(App).inSingletonScope();

container.bind<AuthService>(SERVICES.Auth).to(AuthService).inSingletonScope();
container.bind<PlayerService>(SERVICES.Player).to(PlayerService).inSingletonScope();
container.bind<PlayerStatsService>(SERVICES.PlayerStats).to(PlayerStatsService).inSingletonScope();
container.bind<TournamentService>(SERVICES.Tournament).to(TournamentService).inSingletonScope();
container.bind<SportsCategoryService>(SERVICES.SportsCategory).to(SportsCategoryService).inSingletonScope();
container.bind<GameService>(SERVICES.Game).to(GameService).inSingletonScope();

container.bind<AuthController>(CONTROLLERS.Auth).to(AuthController).inSingletonScope();
container.bind<PlayerController>(CONTROLLERS.Player).to(PlayerController).inSingletonScope();
container.bind<PlayerStatsController>(CONTROLLERS.PlayerStats).to(PlayerStatsController).inSingletonScope();
container.bind<TournamentController>(CONTROLLERS.Tournament).to(TournamentController).inSingletonScope();
container.bind<SportsCategoryController>(CONTROLLERS.SportsCategory).to(SportsCategoryController).inSingletonScope();
container.bind<GameController>(CONTROLLERS.Game).to(GameController).inSingletonScope();

container.bind<AuthMiddleware>(MIDDLEWARES.Auth).to(AuthMiddleware).inSingletonScope();
container.bind<TournamentMiddleware>(MIDDLEWARES.Tournament).to(TournamentMiddleware).inSingletonScope();
container.bind<ErrorHandler>(MIDDLEWARES.Error).to(ErrorHandler).inSingletonScope();

const app = container.get<App>(MAIN.App);

/* const app = new App(
    database,
    authController, 
    sportsCategoryController,
    playerController,
    playerStatsController,
    tournamentController,
    gameController,
    errorHandler
); */

app.start();

