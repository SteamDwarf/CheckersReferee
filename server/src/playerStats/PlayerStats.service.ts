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
import { SportCategoriesAbbr } from "../common/enums";
import Calculations from "../utils/Calculations.service";

@injectable()
class PlayerStatsService extends BaseService {
    private readonly _comparator;

    constructor(
        @inject(MAIN.Utils) private readonly _utils: Utils,
        @inject(MAIN.Calculations) private readonly _calculations: Calculations,
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
            playerStats.lastAdamovichRank = this._calculations.calculateAdamovichAfterGame(
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


            playersStats[i].gorinRank = this._calculations.calculateGorinRank(playersStats[i].id, playerGames, playersStats);
        }
    }
    

    public async updateAfterTournament (playersStats: PlayerStatsDocument[],  games: GameDocument[]) {
        const updatedPlayersStats = [];

        playersStats.sort(this._comparator.compareByScore.bind(this._comparator));

        for(let i = 0; i < playersStats.length; i++) {
            const stat = playersStats[i];
            
            //TODO только если сыграно 7 полноценных партий
            if(stat.competitorsID.length >= 7) {
                console.log("old============\n", stat);
                await this._calculations.calculateSportsCategory(stat, playersStats, stat.competitorsID.length);
                console.log("new=============\n", stat);
            }


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


}

export default PlayerStatsService;