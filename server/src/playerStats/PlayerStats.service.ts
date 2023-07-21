import { inject, injectable } from "inversify";
import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import Utils from "../utils/Utils";
import PlayerStatsComparator from "./PlayerStats.comparator";
import { MAIN, REPOSITORIES, SERVICES } from "../common/injectables.types";
import PlayerDocument from "../players/PlayerDocument.entity";
import { NotFoundError } from "../errors/NotFound.error";
import PlayerStatsRepository from "./PlayerStats.repository";
import PlayerStatsDocument from "./PlayerStatsDocument.entity";
import PlayerStatsPlain from "./PlayerStatsPlain.entity";
import GameDocument from "../games/GameDocument.entity";
import { IPlayerStatsSearchFilter } from "./playerStats.model";
import SportsCategoryService from "../sportsCategory/SportsCategory.service";
import SportsCategoryDocument from "../sportsCategory/SportsCategoryDocument.entity";
import { ISportsCategory } from "../sportsCategory/sportsCategory.model";

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

    public async getPlayersStatsByFilter(tournamentID?: string, playerID?: string) {
        const filter: IPlayerStatsSearchFilter = {};

        tournamentID ? filter.tournamentID = tournamentID : null;
        playerID ? filter.playerID = playerID : null;

        const plainDocuments = await this._playerStatsRepository.getPlayersStatsByFilter(filter);
        return plainDocuments.map(document => new PlayerStatsDocument(document));
    }

    public async getPlayersStatsFromTournament(tournamentID: string) {
        const playersStatsPlainDocuments = await this._playerStatsRepository.getPlayersStatsFromTournament(tournamentID);
        //TODO может сделать проверку на наличие турнира
        return playersStatsPlainDocuments.map(stats => new PlayerStatsDocument(stats));
    }

    /* public async getPlayersStatsFromPlayer(playerID: string) {
        const plainDocuments = await this._playerStatsRepository.getPlayersStatsFromPlayer(playerID);
        return plainDocuments.map(document => new PlayerStatsDocument(document));
    } */

    public async getPlayerStatsByID (id: string) {
        const playerStatsPlainDocument = await this._playerStatsRepository.getPlayerStatsByID(id);

        if(playerStatsPlainDocument) {
            return new PlayerStatsDocument(playerStatsPlainDocument);
        }

        return null;
    }


    public async createPlayerStats(player: PlayerDocument, tournamentID: string) {
        console.log(player.age);
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

    public async updatePlayersStatsAfterGame(
        tournamentGames: GameDocument[],
        oldGameData: GameDocument,
        newGameData: GameDocument
    ) {
        const tournamentPlayersStats = await this.getPlayersStatsFromTournament(oldGameData.tournamentID);
        const player1Stats = tournamentPlayersStats.find(stat => stat.id === oldGameData.player1StatsID);
        const player2Stats = tournamentPlayersStats.find(stat => stat.id === oldGameData.player2StatsID);
        
        player1Stats?.changeScore(player2Stats, oldGameData.player1Score, newGameData.player1Score)
        player2Stats?.changeScore(player1Stats, oldGameData.player2Score, newGameData.player2Score)

        this.updateGorinRank(tournamentPlayersStats, tournamentGames);

        if(player1Stats && player2Stats) {
            const player1AdamovichRank = this.chooseAdamovichRank(oldGameData, player1Stats);
            const player2AdamovichRank = this.chooseAdamovichRank(oldGameData, player2Stats);

            await this.updateAdamovichRank(
                player1Stats, 
                player1AdamovichRank, 
                player2AdamovichRank, 
                newGameData.player1Score
            );
            await this.updateAdamovichRank(
                player2Stats, 
                player2AdamovichRank, 
                player1AdamovichRank, 
                newGameData.player2Score
            );
        } 

        await this.updatePlayersStats(tournamentPlayersStats);
    }

    public async updateAdamovichRank(
        playerStats: PlayerStatsDocument,
        playerAdamovichRank: number,
        competitorAdamovichRank: number,
        curScore: number
    ) {

        if(Math.abs(playerAdamovichRank - competitorAdamovichRank) < 400) {
            playerStats.lastAdamovichRank = this.calculateAdamovichAfterGame(
                                            playerAdamovichRank, 
                                            competitorAdamovichRank, 
                                            curScore
                                        );
        }
        
    }

    private async updateGorinRank(playersStats: PlayerStatsDocument[], games: GameDocument[]) {
        for(let i = 0; i < playersStats.length; i++) {
            const playerGames = games.filter(game => {
                return (game.player1StatsID === playersStats[i].id || game.player2StatsID === playersStats[i].id) 
                        && (game.player1Score !== 0 || game.player2Score !== 0)
            });


            playersStats[i].gorinRank = this.calculateGorinRank(playersStats[i].id, playerGames, playersStats);
        }

        //return await this.updatePlayersStats(playersStats);
    }
    

    public async updateAfterTournament (playersStats: PlayerStatsDocument[],  games: GameDocument[]) {
        const updatedPlayersStats = [];

        /* for(let i = 0; i < playersStats.length; i++) {
            //const sportCategory = await this._sportsCategoryService.getSportsCategoryByID(playersStats[i].sportsCategoryID);

            //if(!sportCategory) throw new NotFoundError("В статистике игрока некверно указано id спортивного разряда");

            const playerGames = games.filter(game => game.player1StatsID === playersStats[i].id || game.player2StatsID === playersStats[i].id);
            //const competitors = playersStats.filter(player => playersStats[i].competitorsID.includes(player.id));

            //playersStats[i].lastAdamovichRank = this.calculateAdamovichAfterTournament(playersStats[i], sportCategory, competitors);
            playersStats[i].gorinRank = this.calculateGorinRank(playersStats[i].id, playerGames, playersStats);
        } */
    
        playersStats.sort(this._comparator.compareByScore.bind(this._comparator));

        for(let i = 0; i < playersStats.length; i++) {
            const stat = playersStats[i];
            stat.place = i + 1;

            const updatedStats = await this.updatePlayerStats(stat);
            updatedPlayersStats.push(updatedStats);
        }

        return updatedPlayersStats;
    }

    public async deletePlayersStats(IDs: (string | undefined)[]) {
        return await this._playerStatsRepository.deletePlayersStats(IDs);
    }

    public async deleteAllPlayersStats (){
        return await this._playerStatsRepository.deleteAllPlayersStats();
    }

    public sortPlayersStatsByScore(playersStats: PlayerStatsDocument[]) {
        return [...playersStats].sort(this._comparator.compareByScore.bind(this._comparator));
    }

    public sortPlayersStatsByAdamovich(playersStats: PlayerStatsDocument[]) {
        return [...playersStats].sort(this._comparator.compareByAdamovichRank.bind(this._comparator));
    }



    private calculateAdamovichAfterGame(
        playerAdamovichRank: number,
        competitorAdamovichRank: number,
        gameScore: number
    ){
        const newRank = (20 * playerAdamovichRank + competitorAdamovichRank + 5000/15 * (gameScore - 1)) / 21;
        return newRank;
    }
    
    private calculateAdamovichAfterTournament (
        playerStats: PlayerStatsDocument, 
        sportsCategory: SportsCategoryDocument, 
        playersStats: PlayerStatsDocument[]
    )
    {
        let playedGames = 0;
    
        const constCoeff = this.getConstCoefficient(playerStats.age, sportsCategory);
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
    
        return newRank;
        //return this.clampAdamovichRank(sportsCategory, newRank);
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

                //console.log(competitorStats.score);
            }
        });
        gorinCoefficient = winedScore * 4 + drawScore * 2 + looseScore;
    
        return gorinCoefficient;
    }
    
    
    private clampAdamovichRank (sportCategory: SportsCategoryDocument, newRank: number) {
        return this._utils.clamp(newRank, sportCategory.minAdamovichRank, sportCategory.maxAdamovichRank);
    }
    
    private getConstCoefficient (age: number, sportsCategory: ISportsCategory){    
        if(sportsCategory.shortTitle == "БР" && age < 17) {
            return 5000/10;
        }
    
        return 5000/15;
    }

    /**
     * Данная функция, в зависимости от того меняется результат уже проведенной партии или еще нет,
     * возвращает нужный рейтинг Адамовича. И если партия уже была сыграна, то меняет текущий рейтинг
     * на предыдущий
     * @param oldGameData - старые данные партии
     * @param playerStats - данные статистики игрока
     * @returns рейтинг Адамовича
     */
    
    private chooseAdamovichRank(oldGameData: GameDocument, playerStats: PlayerStatsDocument) {
        if(oldGameData.player1Score === 0 && oldGameData.player2Score === 0) {
            return playerStats.lastAdamovichRank;
        } else {
            playerStats.lastAdamovichRank = playerStats.startAdamovichRank;
            return playerStats.lastAdamovichRank;
        }
    }

    /* private async changeScore(
        playerStats: PlayerStatsDocument | undefined,
        competitor: PlayerStatsDocument | undefined,
        prevScore: number,
        curScore: number
    ) {
        if(playerStats) {
            playerStats.score = playerStats.score - prevScore + curScore;

            if(competitor) {
                playerStats.normScore =  playerStats.normScore - prevScore + curScore;
            }
        }
    } */

    //TODO age перенести в PlayerStats
    /* private countAge (birthdayString: string){
        const today = new Date();
        const birthdayDate = new Date(birthdayString);
        const monthDiff = today.getMonth() - birthdayDate.getMonth();
    
        let age = today.getFullYear() - birthdayDate.getFullYear();
    
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdayDate.getDate())) {
            age--;
        }
    
        return age;
    } */
}

export default PlayerStatsService;