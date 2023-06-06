import { inject, injectable } from "inversify";
import BaseService from "../common/Base.service";
import { NotFoundError } from "../errors/NotFound.error";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import { REPOSITORIES, SERVICES } from "../common/injectables.types";
import GamePlain from "./GamePlain.entity";
import GamesRepository from "./Games.repository";
import GameDocument from "./GameDocument.entity";
import TournamentService from "../tournaments/Tournament.service";
import GameUpdateDTO from "./dtos/GameUpdate.dto";

@injectable()
class GamesService extends BaseService {
    constructor(
        @inject(SERVICES.PlayerStats) private readonly _playerStatsService: PlayerStatsService,
        @inject(REPOSITORIES.Game) private readonly _gamesRepository: GamesRepository,
        @inject(SERVICES.Tournament) private readonly _tournamentsService: TournamentService
    ) {
        super();
    }

    public async createGame(gamePlain: GamePlain) {
        const gamePlainDocument = await this._gamesRepository.createGame(gamePlain);
        const gameDocument = new GameDocument(gamePlainDocument);

        return gameDocument;
    }

    public async createGames(gamesPlain: GamePlain[]) {
        const gamesDocuments = [];

        for(const game of gamesPlain) {
            const gameDocument = await this.createGame(game);
            gamesDocuments.push(gameDocument);
        }

        return gamesDocuments;
    }

    public async getAllGames() {
        const gamesPlainDocuments = await this._gamesRepository.getAllGames();
        const gamesDocuments = gamesPlainDocuments.map(game => new GameDocument(game));

        return gamesDocuments;
    }

    public async getToursFromTournament(tournamentID: string) {
        const tournament = await this._tournamentsService.getTournamentByID(tournamentID);

        if(!tournament) throw new NotFoundError("По указанному id турнир не найден");

        const tours = tournament.gamesIDs;
        const games: GameDocument[][]  = [];

        if(tours.length > 0) {
            for(const tourGamesIDs of tours) {
                const gamesPlainDocuments = await this._gamesRepository.getGamesByIDs(tourGamesIDs as string[]);
                const gamesDocuments = gamesPlainDocuments.map(game => new GameDocument(game));

                games.push(gamesDocuments);
            }
        }

        return games;

    }

    public async getGamesFromTournament(tournamentID: string) {
        const gamesPlainDocuments = await this._gamesRepository.getGamesFromTournament(tournamentID);
        const gamesDocuments = gamesPlainDocuments.map(game => new GameDocument(game));

        return gamesDocuments;
    }

    public async getGameByID (id: string){
        const gamePlainDocument = await this._gamesRepository.getGameByID(id);

        if(gamePlainDocument) {
            const gameDocument = new GameDocument(gamePlainDocument);
            return gameDocument;
        }

        return null;
    }

    public async deleteAllGames() {
        return await this._gamesRepository.deleteAllGames();
    }

    public async updateGame (id: string, newData: GameUpdateDTO) {
        const oldGameData = await this.getGameByID(id);
        if(!oldGameData) throw new NotFoundError("По указанному id игра не найдена");

        const player1Stats = await this._playerStatsService.getPlayerStatsByID(oldGameData.player1StatsID);
        const player2Stats = await this._playerStatsService.getPlayerStatsByID(oldGameData.player2StatsID);
        
        if(player1Stats) {
            await this._playerStatsService.updateAfterGame(player1Stats, player2Stats?.startAdamovichRank, oldGameData.player1Score, newData.player1Score);
        }
        if(player2Stats) {
            await this._playerStatsService.updateAfterGame(player2Stats, player1Stats?.startAdamovichRank, oldGameData.player2Score, newData.player2Score);
        }
        
        const gamePlainDocument = await this._gamesRepository.updateGame(newData, id);
        const gameDocument = new GameDocument(gamePlainDocument);

        return gameDocument;
    }
}

export default GamesService;

