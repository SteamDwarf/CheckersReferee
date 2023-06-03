import { inject, injectable } from "inversify";
import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import { NotFoundError } from "../errors/NotFound.error";
import { Game, IGame, IGameWithId } from "./games.model";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import { IPlayerStats, IPlayerStatsWithID } from "../playerStats/playerStats.model";
import { MAIN, REPOSITORIES, SERVICES } from "../common/injectables.types";
import { CheckersColor } from "../common/enums";
import GamePlain from "./GamePlain.entity";
import GamesRepository from "./Games.repository";
import GameDocument from "./GameDocument.entity";
import TournamentService from "../tournaments/Tournament.service";
import GameUpdateDTO from "./dtos/GameUpdate.dto";

@injectable()
class GamesService extends BaseService {
    constructor(
        @inject(MAIN.Database) db: DataBase, 
        @inject(SERVICES.PlayerStats) private readonly _playerStatsService: PlayerStatsService,
        @inject(REPOSITORIES.Game) private readonly _gamesRepository: GamesRepository,
        @inject(SERVICES.Tournament) private readonly _tournamentsService: TournamentService
    ) {
        super(db);
    }

    public async createGame(
        tournamentID: string, 
        player1: IPlayerStatsWithID, 
        player2: IPlayerStatsWithID, 
        checkersColor?: CheckersColor[]
    ) {
        /*const game = Game(
            tournamentID,
            player1._id.toString(),
            player1.playerName,
            player2._id.toString(),
            player2.playerName,
            checkersColor ? checkersColor[0] : CheckersColor.black,
            checkersColor ? checkersColor[1] : CheckersColor.black
        );*/
        const gamePlain = new GamePlain(tournamentID, player1, player2, checkersColor);
        const gamePlainDocument = await this._gamesRepository.createGame(gamePlain);
        const gameDocument = new GameDocument(gamePlainDocument);
        //const savedGame = await this.db.createDocument(this.db.collections.games, game) as IGameWithId;

        return gameDocument;
    }

    public async getAllGames() {
        const gamesPlainDocuments = await this._gamesRepository.getAllGames();
        const gamesDocuments = gamesPlainDocuments.map(game => new GameDocument(game));

        return gamesDocuments;
        /* let games;
    
        if(tournamentID) {
            games = await this.db.findDocumentsWithFilter(this.db.collections.games, {tournamentID}) as IGameWithId[];
        } else {
            games = await this.db.findDocuments(this.db.collections.games) as IGameWithId[];
        }   
    
        return games; */
    }

    public async getToursFromTournament(tournamentID: string) {
        const tournament = await this._tournamentsService.getTournamentByID(tournamentID);
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
       // return await this.db.findDocumentById(this.db.collections.games, id) as IGameWithId;
    }

    /* public async getGamesOfTournament(tournamentID: string) {
        return await this.db.findDocumentsWithFilter(this.db.collections.games, {tournamentID}) as IGameWithId[];
    } */

    public async deleteAllGames() {
        return await this._gamesRepository.deleteAllGames();
        //return await this.db.deleteDocuments(this.db.collections.games);
    }

    public async updateGame (id: string, newData: GameUpdateDTO) {
        const oldGameData = await this.getGameByID(id);
        if(!oldGameData) throw new NotFoundError("По указанному id игра не найдена");

        const player1Stats = await this._playerStatsService.getPlayerStatsByID(oldGameData.player1StatsID);
        const player2Stats = await this._playerStatsService.getPlayerStatsByID(oldGameData.player2StatsID);
        
        await this._playerStatsService.updateAfterGame(player1Stats, player2Stats?.startAdamovichRank, oldGameData.player1Score, newData.player1Score);
        await this._playerStatsService.updateAfterGame(player2Stats, player1Stats?.startAdamovichRank, oldGameData.player2Score, newData.player2Score);
        
        const gamePlainDocument = await this._gamesRepository.updateGame(newData, id);
        const gameDocument = new GameDocument(gamePlainDocument);

        return gameDocument;
        //return await this.db.updateDocument(this.db.collections.games, id, newData) as IGameWithId;
    }

    public splitGames(games: GameDocument[], toursCount: number) {
        const gamesInTour = games.length / toursCount;
        const tours: GameDocument[][] = [];
        const toursGamesIDs: string[][] = [];
    
        for(let i = 0; i < toursCount; i++) {
            const tour: GameDocument[] = [];
            const gamesIDs: string[] = [];
    
            for(let j = 0; j < gamesInTour; j++) {
                tour.push(games[j + i * gamesInTour]);
                gamesIDs.push(games[j + i * gamesInTour].id.toString());
            }
    
            tours.push(tour);
            toursGamesIDs.push(gamesIDs);
        }
    
        return {tours, toursGamesIDs}
    }
}

export default GamesService;

/* export const updateGame = expressAsyncHandler(async(request: Request, response: Response) => {
    const gameID = request.params.id;
    const newGameData: IGame = request.body;
    const oldGameData = await findDocumentById(this.db.collections.games, gameID) as IGameWithId;

    if(!oldGameData) throw new NotFoundError("По указанному id игра не найдена");

    const player1Stats = await findDocumentById(this.db.collections.playerStats, oldGameData.player1StatsID) as IPlayerStatsWithID;
    const player2Stats = await findDocumentById(this.db.collections.playerStats, oldGameData.player2StatsID) as IPlayerStatsWithID;

    await updatePlayerStatsAfterGame(player1Stats, player2Stats?.startAdamovichRank, oldGameData.player1Score, newGameData.player1Score);
    await updatePlayerStatsAfterGame(player2Stats, player1Stats?.startAdamovichRank, oldGameData.player2Score, newGameData.player2Score);
    
    const savedGame = await updateDocument(this.db.collections.games, gameID, newGameData) as IGameWithId;

    response.json(savedGame);
}); */

