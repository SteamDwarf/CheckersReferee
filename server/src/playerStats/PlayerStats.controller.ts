import { Request, Response} from "express";
import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import PlayerStatsService from "./PlayerStats.service";

class PlayerStatsController extends BaseController{
    private readonly _playerStatsService;

    constructor(playerStatsService: PlayerStatsService) {
        super();
        this._playerStatsService = playerStatsService;

        this.initRoutes([
            new ControllerRoute('/', 'get', [], this.asyncHandler(this.getPlayersStats)),
            new ControllerRoute('/', 'delete', [], this.asyncHandler(this.deletePlayerStats)),
            new ControllerRoute('/:id', 'get', [], this.asyncHandler(this.getPlayerStatsByID))
        ]);
    }

    private async getPlayersStats(request: Request, response: Response) {
        const playersStats = await this._playerStatsService.getPlayersStats();

        response.json(playersStats);
    }

    private async getPlayerStatsByID(request: Request, response: Response) {
        const {id} = request.params;
        const playerStats = await this._playerStatsService.getPlayerStatsByID(id);

        response.json(playerStats);
    }

    private async deletePlayerStats(request: Request, response: Response) {
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
