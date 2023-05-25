import express from 'express';
import path from "path";
import errorHandler from './middlewares/errorHandler.middleware';
import notFoundHandler from './middlewares/notFoundHandler.middleware';
import { connectToDatabase } from './database/database';
//import authRouter from './routes/auth.router';
import playersRouter from './routes/players.router';
import sportsCategoriesRouter from './routes/sportsCategories.router';
import tournamentsRouter from './routes/tournaments.router';
import gamesRouter from './routes/games.router';
import playerStatsRouter from './routes/playerStats.router';
import cors from 'cors';
import AuthController from './auth/Auth.controller';
import SportsCategoryController from './sportsCategory/SportsCategory.controller';
import PlayerController from './players/Player.controller';

class App {
    private readonly port;
    private readonly uri;
    private readonly app;
    private readonly _authController;
    private readonly _sportsCategoryController;
    private readonly _playerController;

    constructor(
        port: string, 
        uri: string, 
        authController: AuthController, 
        sportCategoryController: SportsCategoryController,
        playerController: PlayerController
    ){
        this.port = port;
        this.uri = uri;
        this.app = express();
        this._authController = authController;
        this._sportsCategoryController = sportCategoryController;
        this._playerController = playerController;
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
        this.app.use('/api/player-stats', playerStatsRouter);
        
        this.app.use(notFoundHandler);
        this.app.use(errorHandler);
    }
    

    
}

export default App;





