import { inject, injectable } from "inversify";
import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import { ISportsCategory } from "../sportsCategory/sportsCategory.model";
import SportsCategoryService from "../sportsCategory/SportsCategory.service";
import Utils from "../utils/Utils";
import PlayerStatsComparator from "./PlayerStats.comparator";
import { MAIN, REPOSITORIES, SERVICES } from "../common/injectables.types";
import PlayerDocument from "../players/PlayerDocument.entity";
import SportsCategoryDocument from "../sportsCategory/SportsCategoryDocument.entity";
import { NotFoundError } from "../errors/NotFound.error";
import PlayerStatsRepository from "./PlayerStats.repository";
import PlayerStatsDocument from "./PlayerStatsDocument.entity";
import PlayerStatsPlain from "./PlayerStatsPlain.entity";
import GameDocument from "../games/GameDocument.entity";

@injectable()
class PlayerStatsService extends BaseService {
    private readonly _comparator;

    constructor(
        @inject(MAIN.Utils) private readonly _utils: Utils,
        @inject(SERVICES.SportsCategory) private readonly _sportsCategoryService: SportsCategoryService,
        @inject(REPOSITORIES.PlayerStats) private readonly _playerStatsRepository: PlayerStatsRepository
    ) {
        super();

        this._comparator = new PlayerStatsComparator();
    }

    public async getAllPlayersStats (){
        const playersStatsPlainDocuments = await this._playerStatsRepository.getAllPlayersStats();
        return playersStatsPlainDocuments.map(stats => new PlayerStatsDocument(stats));
    }

    public async getPlayersStatsFromTournament(tournamentID: string) {
        const playersStatsPlainDocuments = await this._playerStatsRepository.getPlayersStatsFromTournament(tournamentID);
        //TODO может сделать проверку на наличие турнира
        return playersStatsPlainDocuments.map(stats => new PlayerStatsDocument(stats));
    }

    public async getPlayerStatsByID (id: string) {
        const playerStatsPlainDocument = await this._playerStatsRepository.getPlayerStatsByID(id);

        if(playerStatsPlainDocument) {
            return new PlayerStatsDocument(playerStatsPlainDocument);
        }

        return null;
    }


    public async createPlayerStats(player: PlayerDocument, tournamentID: string) {
        const playerStatsPlain = new PlayerStatsPlain(player, tournamentID);
        const playerStatsPlainDocument = await this._playerStatsRepository.createPlayerStats(playerStatsPlain);
        
        return new PlayerStatsDocument(playerStatsPlainDocument);
    }

    public async createPlayersStats(players: PlayerDocument[], tournamentID: string) {
        const playersStatsDocuments: PlayerStatsDocument[] = [];

        for(const player of players) {
            const playerStatsDocument = await this.createPlayerStats(player, tournamentID);
            
            playersStatsDocuments.push(playerStatsDocument);
        }

        return playersStatsDocuments;
    }

    public async updatePlayerStats(playerStats: PlayerStatsDocument) {
        const {_id: id, ...playerStatsData} = playerStats.data;
        //TODO добавить проверку на наличие документ
        const playerStatsPlainDocument = await this._playerStatsRepository.updatePlayerStats(id, playerStatsData);
        if(playerStatsPlainDocument) {
            return new PlayerStatsDocument(playerStatsPlainDocument);
        }
        return null;
    }

    public async updatePlayersStats(playersStats: PlayerStatsDocument[]) {
        const playersStatsDocuments = [];

        for(const stat of playersStats) {
            const playerStatsDocument = await this.updatePlayerStats(stat);

            playersStatsDocuments.push(playerStatsDocument);
        }

        return playersStatsDocuments;
    }

    public async updateAfterGame(
        playerStats: PlayerStatsDocument | undefined, 
        competitorAdamovichRank: number | undefined, 
        prevScore: number, 
        curScore: number
    ) {
        if(playerStats) {
            playerStats.score = playerStats.score - prevScore + curScore;
    
            
            if(competitorAdamovichRank && Math.abs(playerStats.startAdamovichRank - competitorAdamovichRank) < 400) {
                playerStats.lastAdamovichRank = this.calculateAdamovichAfterGame(playerStats, competitorAdamovichRank, curScore);
            }
            
           return await this.updatePlayerStats(playerStats);
        }
    }

    public async updateAfterTournament (playersStats: PlayerStatsDocument[],  games: GameDocument[]) {
        const updatedPlayersStats = [];

        for(let i = 0; i < playersStats.length; i++) {
            const sportCategory = await this._sportsCategoryService.getSportsCategoryByID(playersStats[i].sportsCategoryID);

            if(!sportCategory) throw new NotFoundError("В статистике игрока некверно указано id спортивного разряда");

            const playerGames = games.filter(game => game.player1StatsID === playersStats[i].id || game.player2StatsID === playersStats[i].id);
            
            playersStats[i].lastAdamovichRank = this.calculateAdamovichAfterTournament(playersStats[i], sportCategory, playersStats);
            playersStats[i].gorinRank = this.calculateGorinRank(playersStats[i].id, playerGames, playersStats);
        }
    
        playersStats.sort(this._comparator.compareByScore.bind(this._comparator));
        for(let i = 0; i < playersStats.length; i++) {
            const stat = playersStats[i];
            stat.place = i + 1;

            const updatedStats = await this.updatePlayerStats(stat);
            updatedPlayersStats.push(updatedStats);
        }

        return updatedPlayersStats;
    }

    public async deletePlayersStats (){
        return await this._playerStatsRepository.deletePlayersStats();
    }

    public getSortedPlayersStats(playersStats: PlayerStatsDocument[]) {
        return [...playersStats].sort(this._comparator.compareByScore.bind(this._comparator));
    }

    private calculateAdamovichAfterGame(
        playerStats: PlayerStatsDocument, 
        competitorAdamovichRank: number,
        gameScore: number
    ){
        const newRank = (20 * playerStats.startAdamovichRank + competitorAdamovichRank + 5000/15 * (gameScore - 1)) / 21;
    
        return newRank;
    }
    
    private calculateAdamovichAfterTournament (
        playerStats: PlayerStatsDocument, 
        sportsCategory: SportsCategoryDocument, 
        playersStats: PlayerStatsDocument[]
    )
    {
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
    
        return this.clampAdamovichRank(sportsCategory, newRank);
    }
    
    private calculateGorinRank(playerID: string, games: GameDocument[], playersStats: PlayerStatsDocument[]){
        let winedScore = 0;
        let drawScore = 0;
        let looseScore = 0;
        let gorinCoefficient = 0;
    
        games.map(game => {
            const competitorID = game.player1StatsID === playerID ? game.player2StatsID : game.player1StatsID;
            const competitorStats = playersStats.find(stat => stat.id === competitorID);
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
    
    
    private clampAdamovichRank (sportCategory: SportsCategoryDocument, newRank: number) {
        return this._utils.clamp(newRank, sportCategory.minAdamovichRank, sportCategory.maxAdamovichRank);
    }
    
    private getConstCoefficient (birthdayString: string, sportsCategory: ISportsCategory){
        const age = this.countAge(birthdayString);
    
        if(sportsCategory.shortTitle == "БР" && age < 17) {
            return 5000/10;
        }
    
        return 5000/15;
    }
    
    //TODO age перенести в PlayerStats
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
}

export default PlayerStatsService;