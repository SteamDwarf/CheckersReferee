import express from 'express';
import path from "path";
import cors from 'cors';
import AuthController from './auth/Auth.controller';
import SportsCategoryController from './sportsCategory/SportsCategory.controller';
import PlayerController from './players/Player.controller';
import ErrorHandler from './errors/ErrorHandler.middleware';
import PlayerStatsController from './playerStats/PlayerStats.controller';
import DataBase from './DB/DataBase';
import TournamentController from './tournaments/Tournament.controller';
import GameController from './games/Game.controller';
import { inject, injectable } from 'inversify';
import { CONTROLLERS, MAIN, MIDDLEWARES } from './common/injectables.types';
import RankListController from './documents/rankList/RankList.controller';

@injectable()
class App {
    private readonly _app; 

    constructor(
        @inject(MAIN.AppPort) private readonly _port: string, 
        @inject(MAIN.AppURI) private readonly _uri: string, 
        @inject(MAIN.Database) private readonly _db: DataBase,
        @inject(CONTROLLERS.Auth) private readonly _authController: AuthController, 
        @inject(CONTROLLERS.SportsCategory) private readonly _sportsCategoryController: SportsCategoryController,
        @inject(CONTROLLERS.Player) private readonly _playerController: PlayerController,
        @inject(CONTROLLERS.PlayerStats) private readonly _playerStatsController: PlayerStatsController,
        @inject(CONTROLLERS.Tournament) private readonly _tournamentController: TournamentController,
        @inject(CONTROLLERS.Game) private readonly _gameController: GameController,
        //@inject(CONTROLLERS.RankList) private readonly _rankListController: RankListController,
        @inject(MIDDLEWARES.Error) private readonly _errorHandler: ErrorHandler
    ){
        this._app = express();
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
        this._app.use('/api/tournaments', this._tournamentController.router);
        this._app.use('/api/games', this._gameController.router);
        this._app.use('/api/player-stats', this._playerStatsController.router);
        //this._app.use('/api/documents', this._rankListController.router);
        
        this._app.use(this._errorHandler.handleNotFoundError.bind(this._errorHandler));
        this._app.use(this._errorHandler.handleError.bind(this._errorHandler));
    }
    

    
}

export default App;





