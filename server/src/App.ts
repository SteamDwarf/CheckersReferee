import express from 'express';
import path from "path";
//import authRouter from './routes/auth.router';
import tournamentsRouter from './routes/tournaments.router';
import gamesRouter from './routes/games.router';
import cors from 'cors';
import AuthController from './auth/Auth.controller';
import SportsCategoryController from './sportsCategory/SportsCategory.controller';
import PlayerController from './players/Player.controller';
import ErrorHandler from './errors/ErrorHandler.middleware';
import PlayerStatsController from './playerStats/PlayerStats.controller';
import DataBase from './DB/DataBase';

class App {
    private readonly _port;
    private readonly _uri;
    private readonly _app;
    private readonly _db;
    private readonly _authController;
    private readonly _sportsCategoryController;
    private readonly _playerController;
    private readonly _playerStatsController;
    private readonly _errorHandler;

    constructor(
        port: string, 
        uri: string, 
        database: DataBase,
        authController: AuthController, 
        sportCategoryController: SportsCategoryController,
        playerController: PlayerController,
        playerStatsController: PlayerStatsController,
        errorHandler: ErrorHandler
    ){
        this._port = port;
        this._uri = uri;
        this._app = express();
        this._db = database;
        this._authController = authController;
        this._sportsCategoryController = sportCategoryController;
        this._playerController = playerController;
        this._playerStatsController = playerStatsController;
        this._errorHandler = errorHandler;
    }

    public start(successCallback?: () => void) {
        this.useRoutes();

        this._app.listen(this._port, () => {
            console.log(`Сервер запущен по адресу ${this._uri}:${this._port}`);
            
            if(successCallback) successCallback();

            this._db.connectToDatabase();
        });
    }

    private useRoutes() {
        this._app.use(express.urlencoded({extended: false}));
        this._app.use(express.json());
        this._app.use(express.static(path.resolve('../client')))
        this._app.use(cors());

        this._app.get('/', (request, response) => {
            response.sendFile(path.resolve('../client/index.html'));
        })
        
        this._app.use('/api/auth', this._authController.router);
        this._app.use('/api/players', this._playerController.router);
        this._app.use('/api/sports-categories', this._sportsCategoryController.router);
        this._app.use('/api/tournaments', tournamentsRouter);
        this._app.use('/api/games', gamesRouter);
        this._app.use('/api/player-stats', this._playerStatsController.router);
        
        this._app.use(this._errorHandler.handleNotFoundError.bind(this._errorHandler));
        this._app.use(this._errorHandler.handleError.bind(this._errorHandler));
    }
    

    
}

export default App;






