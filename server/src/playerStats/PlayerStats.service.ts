import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import { IPlayerStatsWithID } from "./playerStats.model";

class PlayerStatsService extends BaseService {
    constructor(db: DataBase) {
        super(db);
    }

    public async getPlayersStats (){
        return await this.db.findDocuments(this.db.collections.playerStats) as IPlayerStatsWithID[];
    }

    public async getPlayerStatsByID (id: string) {
        return await this.db.findDocumentById(this.db.collections.playerStats, id) as IPlayerStatsWithID;
    }

    public async deletePlayersStats (){
        return await this.db.deleteDocuments(this.db.collections.playerStats);
    }

    /* public async updatePlayerStatsAfterGame (
        playerStats: IPlayerStatsWithID | undefined, 
        competitorAdamovichRank: number | undefined, 
        prevScore: number, 
        curScore: number
    ){
        if(playerStats) {
            playerStats.score = playerStats.score - prevScore + curScore;

            
            if(competitorAdamovichRank && Math.abs(playerStats.startAdamovichRank - competitorAdamovichRank) < 400) {
                playerStats.lastAdamovichRank = calculateAdamovichAfterGame(playerStats, competitorAdamovichRank);
                playerStats.lastAdamovichTimeStamp = Date.now();
            }
            

            await updateDocument(getDBCollections().playerStats, playerStats._id.toString(), playerStats);

        }
    }

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
}

export default PlayerStatsService;