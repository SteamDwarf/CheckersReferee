import { inject, injectable } from "inversify";
import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import { IGame } from "./games.model";
import GamesService from "./Games.service";
import {Request, Response} from "express";
import { SERVICES } from "../common/injectables.types";
import ValidateMiddleware from "../common/Validate.middleware";
import GameUpdateDTO from "./dtos/GameUpdate.dto";
import GameDocument from "./GameDocument.entity";

@injectable()
class GamesController extends BaseController {

    constructor(@inject(SERVICES.Game) private readonly _gamesService: GamesService) {
        super();

        this.initRoutes([
            new ControllerRoute('/', 'get', [], this.get),
            new ControllerRoute('/', 'delete', [], this.delete),
            new ControllerRoute('/:id', 'get', [], this.getByID),
            new ControllerRoute('/:id', 'put', 
                [
                    new ValidateMiddleware(GameUpdateDTO),
                ], 
                this.update
            )
        ]);
    }

    private async get(request: Request, response: Response) {
        const tournamentID = request.query.tournamentID?.toString();

        if(tournamentID) {
            const tours = await this._gamesService.getToursFromTournament(tournamentID);
            const toursData = tours.map((tour: GameDocument[] )=> tour.map((game: GameDocument) => game.data));

            response.json(toursData);
        }else {
            const gamesDocuments = await this._gamesService.getAllGames();
            const gamesData = gamesDocuments.map(game => game.data);
            
            response.json(gamesData);
        }    
    }
    private async getByID(request: Request, response: Response) {
        const {id} = request.params;
        const game = await this._gamesService.getGameByID(id);
    
        response.json(game ? game.data : null);
    }
    private async update(request: Request, response: Response) {
        const gameID = request.params.id;
        const newGameData: IGame = request.body;
        const updatedGame = await this._gamesService.updateGame(gameID, newGameData);

        response.json(updatedGame.data);
    }
    private async delete(request: Request, response: Response) {
        const result = await this._gamesService.deleteAllGames();
        console.log(result);
        response.json(result);
    }
}

export default GamesController;