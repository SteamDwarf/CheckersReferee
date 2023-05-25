import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import { IGame } from "../models/games.model";
import { ISportsCategory } from "../models/sportsCategory.model";
import Utils from "../utils/Utils";
import { IPlayerStats, IPlayerStatsWithID } from "./playerStats.model";

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

    private calculateAdamovichAfterGame(playerStats: IPlayerStats, competitorAdamovichRank: number){
        const newRank = (20 * playerStats.startAdamovichRank + competitorAdamovichRank + 5000/15 * (playerStats.score - 1)) / 21;
    
        return newRank;
    }
    
    private calculateAdamovichAfterTournament (playerStats: IPlayerStats, sportsCategory: ISportsCategory, playersStats: IPlayerStats[]){
        let playedGames = 0;
    
        const constCoeff = this.getConstCoefficient(playerStats.birthday, sportsCategory);
        const sumCompetitorsRank = playersStats.reduce((sum, curPlayerStats) => {
            if(playerStats.playerID !== curPlayerStats.playerID && 
                Math.abs(playerStats.startAdamovichRank - curPlayerStats.startAdamovichRank) < 400
            ) {
                playedGames += 1;
                return sum += curPlayerStats.startAdamovichRank;
            }
    
            return sum;
        }, 0);
    
        const newRank = (20 * playerStats.startAdamovichRank + sumCompetitorsRank + constCoeff * (playerStats.score - playedGames)) / (20 + playedGames);
    
        //return newRank;
        return this.clampAdamovichRank(sportsCategory, newRank);
    }
    
    private calculateGorinRank(playerID: string, games: IGame[], playersStats: IPlayerStatsWithID[]){
        let winedScore = 0;
        let drawScore = 0;
        let looseScore = 0;
        let gorinCoefficient = 0;
    
        games.map(game => {
            const competitorID = game.player1StatsID === playerID ? game.player2StatsID : game.player1StatsID;
            const competitorStats = playersStats.find(stat => stat._id.toString() === competitorID);
            const playerScore = game.player1StatsID === playerID ? game.player1Score : game.player2Score;
    
            if(competitorStats) {
                if(playerScore === 2) {
                    winedScore += competitorStats.score;
                } else if(playerScore === 1) {
                    drawScore += competitorStats.score;
                } else {
                    looseScore += competitorStats.score;
                }
            }
        });
        gorinCoefficient = winedScore * 4 + drawScore * 2 + looseScore;
    
        return gorinCoefficient;
    }
    
    
    private clampAdamovichRank (sportCategory: ISportsCategory, newRank: number) {
        return Utils.clamp(newRank, sportCategory.minAdamovichRank, sportCategory.maxAdamovichRank);
    }
    
    private getPlayerName (player: {firstName: string, middleName: string, lastName: string}) {
        return [player.firstName, player.middleName, player.lastName].join(" ").trim();
    }
    
    private getConstCoefficient (birthdayString: string, sportsCategory: ISportsCategory){
        const age = this.countAge(birthdayString);
    
        if(sportsCategory.shortTitle == "БР" && age < 17) {
            return 5000/10;
        }
    
        return 5000/15;
    }
    
    private countAge (birthdayString: string){
        const today = new Date();
        const birthdayDate = new Date(birthdayString);
        const monthDiff = today.getMonth() - birthdayDate.getMonth();
    
        let age = today.getFullYear() - birthdayDate.getFullYear();
    
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdayDate.getDate())) {
            age--;
        }
    
        return age;
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