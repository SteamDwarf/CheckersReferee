import { Request, Response } from "express";
import { IPlayer} from "./players.model";
import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import PlayerService from "./Players.service";
import { inject, injectable } from "inversify";
import { SERVICES } from "../common/injectables.types";
import ValidateMiddleware from "../common/Validate.middleware";
import PlayerCreateDTO from "./dtos/PlayerCreate.dto";
import PlayerUpdateDTO from "./dtos/PlayerUpdate.dto";
import PlayerExistMiddleware from "./middlewares/PlayerExist.middleware";

@injectable()
class PlayerController extends BaseController{
    private readonly _playerExistMiddleware: PlayerExistMiddleware;

    constructor(@inject(SERVICES.Player) private readonly _playerService: PlayerService) {
        super();
        this._playerExistMiddleware = new PlayerExistMiddleware(this._playerService);

        this.initRoutes([
            new ControllerRoute('/', 'get', [], this.get),
            new ControllerRoute('/', 'post', 
                [new ValidateMiddleware(PlayerCreateDTO)], 
                this.create
            ),
            new ControllerRoute('/:id', 'get', [], this.getById),
            new ControllerRoute('/:id', 'put', 
                [
                    this._playerExistMiddleware,
                    new ValidateMiddleware(PlayerUpdateDTO)
                ], 
                this.update
            ),
            new ControllerRoute('/:id', 'delete', 
                [this._playerExistMiddleware], 
                this.delete
            ),
        ])
    }

    private async create(request: Request, response: Response) {
        const playerData = request.body;
        const createdPlayer = await this._playerService.createPlayer(playerData);

        response.status(201).json(createdPlayer.data);
    }

    private async getById(request: Request, response: Response) {
        const {id} = request.params;
        const player = await this._playerService.getPlayerByID(id);

        response.json(player ? player.data : null);
    }
    private async get(request: Request, response: Response) {
        const tournamentID = request.query.tournamentID?.toString();

        if(tournamentID) {
            //TODO проверить с турниром без игроков
            const playersDocuments = await this._playerService.getPlayersFromTournament(tournamentID);
            const playersData = playersDocuments.map(document => document.data);
            response.json(playersData);
        }else {
            const page = request.query.page || "1";
            const limit = request.query.limit || "10";
            const playersDocuments = await this._playerService.getAllPlayers();
            const playersData = playersDocuments.map(document => document.data);
            
            response.setHeader("x-total-count", playersDocuments.length);
            response.json(this.paginateData(playersData, +limit, +page));
        }        
    }
    
    private async update(request: Request, response: Response) {
        const {id} = request.params;
        const updatedPlayer = await this._playerService.updatePlayer(id, request.body);

        response.json(updatedPlayer.data);
    }
    private async delete(request: Request, response: Response) {
        const {id} = request.params;
        const deleteResult = await this._playerService.deletePlayer(id);

        response.json(deleteResult);
    }
}

export default PlayerController;

