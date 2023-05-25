import express from 'express';
import path from "path";
import { connectToDatabase } from './database/database';
//import authRouter from './routes/auth.router';
import tournamentsRouter from './routes/tournaments.router';
import gamesRouter from './routes/games.router';
import playerStatsRouter from './routes/playerStats.router';
import cors from 'cors';
import AuthController from './auth/Auth.controller';
import SportsCategoryController from './sportsCategory/SportsCategory.controller';
import PlayerController from './players/Player.controller';
import ErrorHandler from './errors/ErrorHandler.middleware';
import PlayerStatsController from './playerStats/PlayerStats.controller';

class App {
    private readonly port;
    private readonly uri;
    private readonly app;
    private readonly _authController;
    private readonly _sportsCategoryController;
    private readonly _playerController;
    private readonly _playerStatsController;
    private readonly _errorHandler;

    constructor(
        port: string, 
        uri: string, 
        authController: AuthController, 
        sportCategoryController: SportsCategoryController,
        playerController: PlayerController,
        playerStatsController: PlayerStatsController,
        errorHandler: ErrorHandler
    ){
        this.port = port;
        this.uri = uri;
        this.app = express();
        this._authController = authController;
        this._sportsCategoryController = sportCategoryController;
        this._playerController = playerController;
        this._playerStatsController = playerStatsController;
        this._errorHandler = errorHandler;
    }

    public start(successCallback?: () => void) {
        this.useRoutes();

        this.app.listen(this.port, () => {
            console.log(`Сервер запущен по адресу ${this.uri}:${this.port}`);
            
            if(successCallback) successCallback();

            connectToDatabase();
        });
    }

    private useRoutes() {
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(express.json());
        this.app.use(express.static(path.resolve('../client')))
        this.app.use(cors());

        this.app.get('/', (request, response) => {
            response.sendFile(path.resolve('../client/index.html'));
        })
        
        //this.app.use('/api/auth', authRouter);
        this.app.use('/api/auth', this._authController.router);
        this.app.use('/api/players', this._playerController.router);
        this.app.use('/api/sports-categories', this._sportsCategoryController.router);
        this.app.use('/api/tournaments', tournamentsRouter);
        this.app.use('/api/games', gamesRouter);
        this.app.use('/api/player-stats', this._playerStatsController.router);
        
        this.app.use(this._errorHandler.handleNotFoundError.bind(this._errorHandler));
        this.app.use(this._errorHandler.handleError.bind(this._errorHandler));
    }
    

    
}

export default App;






