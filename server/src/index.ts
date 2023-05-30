import "reflect-metadata";

import * as dotenv from 'dotenv';

import App from './App';
import ErrorHandler from './errors/ErrorHandler.middleware';
import DataBase from './DB/DataBase';
import { Container, ContainerModule, interfaces } from "inversify";
import { MAIN, MIDDLEWARES} from "./common/injectables.types";
import Utils from "./utils/Utils";
import authBindings from "./auth/Auth.bindings";
import gameBindings from "./games/Game.bindings";
import playerBindings from "./players/Players.bindings";
import playerStatsBindings from "./playerStats/PlayerStats.bindings";
import tournamentBindings from "./tournaments/Tournament.bindings";
import sportsCategoriesBindings from "./sportsCategory/SporttsCategory.bindings";

dotenv.config({path: `${__dirname}/../.env`});

const PORT = process.env.PORT || '5000';
const URI = process.env.URI || 'http://localhost';
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<string>(MAIN.AppURI).toConstantValue(URI);
    bind<string>(MAIN.AppPort).toConstantValue(PORT);
    bind<string>(MAIN.DatabaseURI).toConstantValue(MONGO_URI);
    bind<DataBase>(MAIN.Database).to(DataBase).inSingletonScope();
    bind<App>(MAIN.App).to(App);
    bind<Utils>(MAIN.Utils).to(Utils);
    bind<ErrorHandler>(MIDDLEWARES.Error).to(ErrorHandler);
});

const container = new Container();

container.load(
    appBindings,
    authBindings,
    gameBindings,
    playerBindings,
    playerStatsBindings,
    tournamentBindings,
    sportsCategoriesBindings
)



//container.bind<RankListRepository>(REPOSITORIES.RankList).to(RankListRepository);

//container.bind<RankListService>(SERVICES.RankList).to(RankListService);

//container.bind<RankListController>(CONTROLLERS.RankList).to(RankListController);

//container.bind<AuthMiddleware>(MIDDLEWARES.Auth).to(AuthMiddleware);
//container.bind<TournamentMiddleware>(MIDDLEWARES.Tournament).to(TournamentMiddleware);
//container.bind<RankListMiddleware>(MIDDLEWARES.RankList).to(RankListMiddleware);

const app = container.get<App>(MAIN.App);

app.start();