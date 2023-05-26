import { Request, Response } from "express";
import { IPlayer} from "./players.model";
import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import PlayerService from "./Player.service";


class PlayerController extends BaseController{
    private readonly _playerService;

    constructor(playerService: PlayerService) {
        super();

        this._playerService = playerService;
        this.initRoutes([
            new ControllerRoute('/', 'get', [], this.asyncHandler(this.get)),
            new ControllerRoute('/', 'post', [], this.asyncHandler(this.create)),
            new ControllerRoute('/:id', 'get', [], this.asyncHandler(this.getById)),
            new ControllerRoute('/:id', 'put', [], this.asyncHandler(this.update)),
            new ControllerRoute('/:id', 'delete', [], this.asyncHandler(this.delete)),
        ])
    }

    private async create(request: Request, response: Response) {
        console.log("work");
        const playerData: IPlayer = request.body;
        const createdPlayer = await this._playerService.createPlayer(playerData);

        response.status(201).json(createdPlayer);
    }
    private async get(request: Request, response: Response) {
        console.log("work");

        const page = request.query.page || "1";
        const limit = request.query.limit || "10";
        const players = await this._playerService.getAllPlayers(+page, +limit);

        response.json(players);
    }
    private async getById(request: Request, response: Response) {
        console.log("work");

        const {id} = request.params;
        const player = await this._playerService.getPlayer(id);

        response.json(player);
    }
    private async update(request: Request, response: Response) {
        console.log("work");

        const {id} = request.params;
        const playerData: IPlayer = request.body;
        const updatedPlayer = await this._playerService.updatePlayer(id, playerData);

        response.json(updatedPlayer);
    }
    private async delete(request: Request, response: Response) {
        console.log("work");

        const {id} = request.params;
        const deleteResult = await this._playerService.deletePlayer(id);

        response.json(deleteResult);
    }
}

export default PlayerController;

/* export const updatePlayersAfterTournament = async(playersStats: IPlayerStatsWithID[]) => {
    const updatedPlayers = [];

    for(let i = 0; i < playersStats.length; i++) {
        const stat = playersStats[i];
        const player = await findDocumentById(getDBCollections().players, stat.playerID) as IPlayerWithId;

        player.previousAdamovichRank = player.currentAdamovichRank;
        player.currentAdamovichRank = stat.lastAdamovichRank;

        const updatedPlayer = await updateDocument(getDBCollections().players, player._id.toString(), player);

        updatedPlayers.push(updatedPlayer);
    }

    return updatedPlayers;
} */

