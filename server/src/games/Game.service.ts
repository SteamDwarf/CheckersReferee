import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import { CheckersColor, Game, IGameWithId } from "../models/games.model";
import { IPlayerStats, IPlayerStatsWithID } from "../playerStats/playerStats.model";

class GameService extends BaseService {
    constructor(db: DataBase) {
        super(db);
    }

    public async createGame(
        tournamentID: string, 
        player1: IPlayerStatsWithID, 
        player2: IPlayerStatsWithID, 
        checkersColor?: CheckersColor[]
    ) {
        const game = Game(
            tournamentID,
            player1._id.toString(),
            player1.playerName,
            player2._id.toString(),
            player2.playerName,
            checkersColor ? checkersColor[0] : CheckersColor.black,
            checkersColor ? checkersColor[1] : CheckersColor.black
        );
        const savedGame = await this.db.createDocument(this.db.collections.games, game) as IGameWithId;

        return savedGame;
    }

    public async getGames(tournamentID: string | undefined) {
        let games;
    
        if(tournamentID) {
            games = await this.db.findDocumentsWithFilter(this.db.collections.games, {tournamentID}) as IGameWithId[];
        } else {
            games = await this.db.findDocuments(this.db.collections.games) as IGameWithId[];
        }   
    
        return games;
    }

    public async getGameByID (id: string){
        return await this.db.findDocumentById(this.db.collections.games, id) as IGameWithId;
    }

    public async deleteGames() {
        return await this.db.deleteDocuments(this.db.collections.games);
    }

    public splitGames(games: IGameWithId[], toursCount: number) {
        const gamesInTour = games.length / toursCount;
        const tours: IGameWithId[][] = [];
        const toursGamesIDs: string[][] = [];
    
        for(let i = 0; i < toursCount; i++) {
            const tour: IGameWithId[] = [];
            const gamesIDs: string[] = [];
    
            for(let j = 0; j < gamesInTour; j++) {
                tour.push(games[j + i * gamesInTour]);
                gamesIDs.push(games[j + i * gamesInTour]._id.toString());
            }
    
            tours.push(tour);
            toursGamesIDs.push(gamesIDs);
        }
    
        return {tours, toursGamesIDs}
    }
}

export default GameService;

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

