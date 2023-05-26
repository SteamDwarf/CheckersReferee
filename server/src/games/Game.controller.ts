import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import { IGame } from "../models/games.model";
import GameService from "./Game.service";
import {Request, Response} from "express";

class GameController extends BaseController {
    private readonly _gameService;

    constructor(gameService: GameService) {
        super();

        this._gameService = gameService;
        this.initRoutes([
            new ControllerRoute('/', 'get', [], this.asyncHandler(this.get)),
            new ControllerRoute('/', 'delete', [], this.asyncHandler(this.delete)),
            new ControllerRoute('/:id', 'get', [], this.asyncHandler(this.getByID)),
            new ControllerRoute('/:id', 'put', [], this.asyncHandler(this.update))
        ]);
    }

    private async get(request: Request, response: Response) {
        const tournamentID = request.query.tournamentID?.toString();
        const games = await this._gameService.getGames(tournamentID);

        response.json(games);
    }
    private async getByID(request: Request, response: Response) {
        const {id} = request.params;
        const game = await this._gameService.getGameByID(id);
    
        response.json(game)
    }
    private async update(request: Request, response: Response) {
        const gameID = request.params.id;
        const newGameData: IGame = request.body;
        const updatedGame = await this._gameService.updateGame(gameID, newGameData);

        response.json(updatedGame);
    }
    private async delete(request: Request, response: Response) {
        const result = await this._gameService.deleteGames();

        response.json(result);
    }
}

export default GameController;


/* export const updateGame = expressAsyncHandler(async(request: Request, response: Response) => {
    const gameID = request.params.id;
    const newGameData: IGame = request.body;
    const oldGameData = await findDocumentById(getDBCollections().games, gameID) as IGameWithId;


    if(!oldGameData) throw new NotFoundError("По указанному id игра не найдена");

    const player1Stats = await findDocumentById(getDBCollections().playerStats, oldGameData.player1StatsID) as IPlayerStatsWithID;
    const player2Stats = await findDocumentById(getDBCollections().playerStats, oldGameData.player2StatsID) as IPlayerStatsWithID;

    await updatePlayerStatsAfterGame(player1Stats, player2Stats?.startAdamovichRank, oldGameData.player1Score, newGameData.player1Score);
    await updatePlayerStatsAfterGame(player2Stats, player1Stats?.startAdamovichRank, oldGameData.player2Score, newGameData.player2Score);
    
    const savedGame = await updateDocument(getDBCollections().games, gameID, newGameData) as IGameWithId;

    response.json(savedGame);
}); */