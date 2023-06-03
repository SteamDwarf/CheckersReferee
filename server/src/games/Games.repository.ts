import { inject, injectable } from "inversify";
import BaseRepository from "../common/Base.repository";
import { MAIN } from "../common/injectables.types";
import DataBase from "../DB/DataBase";
import { IGame, IGameWithId } from "./games.model";
import GameUpdateDTO from "./dtos/GameUpdate.dto";

@injectable()
class GamesRepository extends BaseRepository{
    constructor(
        @inject(MAIN.Database) database: DataBase
    ) {
        super(database);
    }

    public async createGame(game: IGame) {
        return await this.db.createDocument(this.db.collections.games, game) as IGameWithId;
    }

    public async getAllGames() {
        return await this.db.findDocuments(this.db.collections.games) as IGameWithId[];
    }

    public async getGameByID(id: string) {
        return await this.db.findDocumentById(this.db.collections.games, id) as IGameWithId | null;
    }

    public async getGamesByIDs(ids: string[]) {
        return await this.db.findDocumentsById(this.db.collections.games, ids) as IGameWithId[]
    }

    public async deleteAllGames() {
        return await this.db.deleteDocuments(this.db.collections.games);
    }

    public async updateGame(gameData: GameUpdateDTO, id: string) {
        return await this.db.updateDocument(this.db.collections.games, id, gameData) as IGameWithId;
    }

    public async getGamesFromTournament(tournamentID: string) {
        return await this.db.findDocumentsWithFilter(this.db.collections.games, {tournamentID}) as IGameWithId[];
    }
}

export default GamesRepository;