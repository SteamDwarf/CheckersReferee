import { Request, Response} from "express";
import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import PlayerStatsService from "./PlayerStats.service";
import { inject, injectable } from "inversify";
import { SERVICES } from "../common/injectables.types";
import PlayerStatsDocument from "./PlayerStatsDocument.entity";

@injectable()
class PlayerStatsController extends BaseController{
    constructor(@inject(SERVICES.PlayerStats) private readonly _playerStatsService: PlayerStatsService) {
        super();

        this.initRoutes([
            new ControllerRoute('/', 'get', [], this.get),
            new ControllerRoute('/', 'delete', [], this.delete),
            new ControllerRoute('/:id', 'get', [], this.getByID)
        ]);
    }

    private async get(request: Request, response: Response) {
        const tournamentID = request.query.tournamentID?.toString();
        const playerID = request.query.playerID?.toString();

        let playersStatsDocuments: PlayerStatsDocument[] = [];

        /* if(tournamentID) {
            playersStatsDocuments = await this._playerStatsService.getPlayersStatsFromTournament(tournamentID);
        } else if(playerID) {
            playersStatsDocuments = await this._playerStatsService.getPlayersStatsFromPlayer(playerID); */
        if(tournamentID || playerID) {
            playersStatsDocuments = await this._playerStatsService.getPlayersStatsByFilter(tournamentID, playerID);
        } else {
            playersStatsDocuments = await this._playerStatsService.getAllPlayersStats();
        }

        const playersStats = playersStatsDocuments.map(stats => stats.data);

        response.json(playersStats);
    }

    private async getByID(request: Request, response: Response) {
        const {id} = request.params;
        const playerStats = await this._playerStatsService.getPlayerStatsByID(id);

        response.json(playerStats ? playerStats.data : null);
    }

    private async delete(request: Request, response: Response) {
        const deleteResult = await this._playerStatsService.deletePlayersStats();

        response.json(deleteResult);
    }
}

export default PlayerStatsController;
