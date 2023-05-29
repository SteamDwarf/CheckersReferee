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
import { CONTROLLERS, MAIN, MIDDLEWARES, REPOSITORIES, SERVICES } from "./common/injectables.types";
import Utils from "./utils/Utils";
import RankListService from "./documents/rankList/RankList.service";
import RankListController from "./documents/rankList/RankList.controller";
import RankListRepository from "./documents/rankList/RankList.repository";
import RankListMiddleware from "./documents/rankList/RankList.middleware";
import DocumentsDatabase from "./documents/DocumentsDatabase";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires

dotenv.config({path: `${__dirname}/../.env`});

const PORT = process.env.PORT || '5000';
const URI = process.env.URI || 'http://localhost';
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

const container = new Container();

container.bind<string>(MAIN.AppURI).toConstantValue(URI);
container.bind<string>(MAIN.AppPort).toConstantValue(PORT);
container.bind<string>(MAIN.DatabaseURI).toConstantValue(MONGO_URI);
container.bind<DataBase>(MAIN.Database).to(DataBase).inSingletonScope();
container.bind<App>(MAIN.App).to(App);
container.bind<Utils>(MAIN.Utils).to(Utils);

container.bind<RankListRepository>(REPOSITORIES.RankList).to(RankListRepository);

container.bind<AuthService>(SERVICES.Auth).to(AuthService);
container.bind<PlayerService>(SERVICES.Player).to(PlayerService);
container.bind<PlayerStatsService>(SERVICES.PlayerStats).to(PlayerStatsService);
container.bind<TournamentService>(SERVICES.Tournament).to(TournamentService);
container.bind<SportsCategoryService>(SERVICES.SportsCategory).to(SportsCategoryService);
container.bind<GameService>(SERVICES.Game).to(GameService);
container.bind<RankListService>(SERVICES.RankList).to(RankListService);

container.bind<AuthController>(CONTROLLERS.Auth).to(AuthController);
container.bind<PlayerController>(CONTROLLERS.Player).to(PlayerController);
container.bind<PlayerStatsController>(CONTROLLERS.PlayerStats).to(PlayerStatsController);
container.bind<TournamentController>(CONTROLLERS.Tournament).to(TournamentController);
container.bind<SportsCategoryController>(CONTROLLERS.SportsCategory).to(SportsCategoryController);
container.bind<GameController>(CONTROLLERS.Game).to(GameController);
container.bind<RankListController>(CONTROLLERS.RankList).to(RankListController);

container.bind<AuthMiddleware>(MIDDLEWARES.Auth).to(AuthMiddleware);
container.bind<TournamentMiddleware>(MIDDLEWARES.Tournament).to(TournamentMiddleware);
container.bind<RankListMiddleware>(MIDDLEWARES.RankList).to(RankListMiddleware);
container.bind<ErrorHandler>(MIDDLEWARES.Error).to(ErrorHandler);

const app = container.get<App>(MAIN.App);

app.start();