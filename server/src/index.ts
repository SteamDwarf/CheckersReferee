import "reflect-metadata";

import * as dotenv from 'dotenv';

import App from './App';
import ErrorHandler from './errors/ErrorHandler.middleware';
import DataBase from './DB/DataBase';
import { Container, ContainerModule, interfaces } from "inversify";
import { MAIN, MIDDLEWARES, SERVICES} from "./common/injectables.types";
import Utils from "./utils/Utils";
import authBindings from "./auth/Auth.bindings";
import gameBindings from "./games/Game.bindings";
import playerBindings from "./players/Players.bindings";
import playerStatsBindings from "./playerStats/PlayerStats.bindings";
import tournamentBindings from "./tournaments/Tournament.bindings";
import sportsCategoriesBindings from "./sportsCategory/SporttsCategory.bindings";
import DocumentsDatabase from "./DB/DocumentsDatabase";
import path from "path";
import documentsBindings from "./documents/Documents.bindings";
import TournamentService from "./tournaments/Tournament.service";
import SportsCategoryService from "./sportsCategory/SportsCategory.service";
import PlayerStatsService from "./playerStats/PlayerStats.service";
import Calculations from "./utils/Calculations.service";

dotenv.config({path: `${__dirname}/../.env`});

const PORT = process.env.PORT || '5000';
const URI = process.env.URI || 'http://localhost';
const MONGO_URI = process.env.MONGO_URI || "127.0.0.1:27017";
const DOCUMENTS_PATH = path.resolve(__dirname, "assets/documents");
const ACCESS_SECRET = process.env.ACCESS_SECRET || "";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "";

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<string>(MAIN.AppURI).toConstantValue(URI);
    bind<string>(MAIN.AppPort).toConstantValue(PORT);
    bind<string>(MAIN.DatabaseURI).toConstantValue(MONGO_URI);
    bind<string>(MAIN.DocumentsPath).toConstantValue(DOCUMENTS_PATH);
    bind<string>(MAIN.AccessSecret).toConstantValue(ACCESS_SECRET);
    bind<string>(MAIN.RefreshSecret).toConstantValue(REFRESH_SECRET);
    bind<string>(MAIN.CookieSecret).toConstantValue(COOKIE_SECRET);

    bind<DataBase>(MAIN.Database).to(DataBase).inSingletonScope();
    bind<DocumentsDatabase>(MAIN.DocumentsDatabase).to(DocumentsDatabase).inSingletonScope();
    bind<App>(MAIN.App).to(App);
    bind<Utils>(MAIN.Utils).to(Utils);
    bind<Calculations>(MAIN.Calculations).to(Calculations);
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
    sportsCategoriesBindings,
    documentsBindings
)

const app = container.get<App>(MAIN.App);
const tournamentService = container.get<TournamentService>(SERVICES.Tournament);
const playerStatsService = container.get<PlayerStatsService>(SERVICES.PlayerStats);
//const sportsCategoriesService = container.get<SportsCategoryService>(SERVICES.SportsCategory);

app.start(() => {
    //sportsCategoriesService.getSportsCategoryScore("6499ee12080f2d400936656d", "6499ee12080f2d4009366573").then(d => console.log(d));
});
tournamentService.lazyInject(container);


/* function countAge (birthdayString: string){
    const today = new Date();
    const birthdayDate = new Date(birthdayString);
    const monthDiff = today.getMonth() - birthdayDate.getMonth();
    
    let age = today.getFullYear() - birthdayDate.getFullYear();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdayDate.getDate())) {
        age--;
    }

    return age;
} */