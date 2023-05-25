import { Request, Response } from "express";
import { createDocument, findDocuments, deleteDocument, updateDocument, getDBCollections, findDocumentById } from "../database/database";
import { IPlayer, IPlayerWithId} from "../models/players.model";
import { ISportsCategoryWithID } from "../models/sportsCategory.model";
import { paginateData } from "../utils/controllers.utils";
import expressAsyncHandler from "express-async-handler";
import {NotFoundError} from "../utils/ServerError";
import { IPlayerStatsWithID } from "../models/playerStats.model";
import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import PlayerService from "./Player.service";


class PlayerController extends BaseController{
    private readonly _playerService;

    constructor(playerService: PlayerService) {
        super();

        this._playerService = playerService;
        this.initRoutes([
            new ControllerRoute('/', 'get', [], this.asyncHandler(this.getPlayers)),
            new ControllerRoute('/', 'post', [], this.asyncHandler(this.createPlayer)),
            new ControllerRoute('/:id', 'get', [], this.asyncHandler(this.getPlayer)),
            new ControllerRoute('/:id', 'put', [], this.asyncHandler(this.updatePlayer)),
            new ControllerRoute('/:id', 'delete', [], this.asyncHandler(this.deletePlayer)),
        ])
    }

    private async createPlayer(request: Request, response: Response) {
        console.log("work");
        const playerData: IPlayer = request.body;
        const createdPlayer = await this._playerService.createPlayer(playerData);

        response.status(201).json(createdPlayer);
    }
    private async getPlayers (request: Request, response: Response) {
        console.log("work");

        const page = request.query.page || "1";
        const limit = request.query.limit || "10";
        const players = await this._playerService.getPlayers(+page, +limit);

        response.json(players);
    }
    private async getPlayer (request: Request, response: Response) {
        console.log("work");

        const {id} = request.params;
        const player = await this._playerService.getPlayer(id);

        response.json(player);
    }
    private async updatePlayer (request: Request, response: Response) {
        console.log("work");

        const {id} = request.params;
        const playerData: IPlayer = request.body;
        const updatedPlayer = await this._playerService.updatePlayer(id, playerData);

        response.json(updatedPlayer);
    }
    private async deletePlayer (request: Request, response: Response) {
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
