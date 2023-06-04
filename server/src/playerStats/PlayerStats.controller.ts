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
            //TODO добавить middleware на проверку существования документа
            new ControllerRoute('/', 'delete', [], this.delete),
            new ControllerRoute('/:id', 'get', [], this.getByID)
        ]);
    }

    private async get(request: Request, response: Response) {
        const tournamentID = request.query.tournamentID?.toString();
        let playersStatsDocuments: PlayerStatsDocument[] = [];

        if(tournamentID) {
            playersStatsDocuments = await this._playerStatsService.getPlayersStatsOfTournament(tournamentID);
        }else {
            playersStatsDocuments = await this._playerStatsService.getAllPlayersStats();
        }

        const playersStats = playersStatsDocuments.map(stats => stats.data);

        response.json(playersStats);
        //const playersStats = await this._playerStatsService.getPlayersStats();

        //response.json(playersStats);
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

/* export const updatePlayerStatsAfterGame = async(
        playerStats: IPlayerStatsWithID | undefined, 
        competitorAdamovichRank: number | undefined, 
        prevScore: number, 
        curScore: number
    ) => {

    if(playerStats) {

        playerStats.score = playerStats.score - prevScore + curScore;

        
        if(competitorAdamovichRank && Math.abs(playerStats.startAdamovichRank - competitorAdamovichRank) < 400) {
            playerStats.lastAdamovichRank = calculateAdamovichAfterGame(playerStats, competitorAdamovichRank);
            playerStats.lastAdamovichTimeStamp = Date.now();
        }
        

       await updateDocument(getDBCollections().playerStats, playerStats._id.toString(), playerStats);

    }
};

export const updatePlayerStatsAfterTournament = async(playersStats: IPlayerStatsWithID[],  games: IGame[]) => {
    for(let i = 0; i < playersStats.length; i++) {
        const sportCategory = await findDocumentById(getDBCollections().sportsCategories, playersStats[i].sportsCategoryID) as ISportsCategoryWithID;
        const playerGames = games.filter(game => game.player1StatsID === playersStats[i]._id.toString() || game.player2StatsID === playersStats[i]._id.toString());
        
        playersStats[i].lastAdamovichRank = calculateAdamovichAfterTournament(playersStats[i], sportCategory, playersStats);
        playersStats[i].gorinRank = calculateGorinRank(playersStats[i]._id.toString(), playerGames, playersStats);
    }

    playersStats.sort(compareByScore);
    playersStats = playersStats.map((stat, i) => {
        stat.place = i + 1;
        stat.startAdamovichRank = stat.lastAdamovichRank;
        return stat;
    });

    return updateDocuments(getDBCollections().playerStats, playersStats);
} */
