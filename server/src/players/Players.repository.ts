import { injectable } from "inversify";
import BaseRepository from "../common/Base.repository";
import { IPlayer, IPlayerWithId } from "./players.model";

@injectable()
class PlayerRepository extends BaseRepository{
    public async createPlayer(player: IPlayer) {
        return await this.db.createDocument(this.db.collections.players, player) as IPlayerWithId;
    }

    public async getPlayerByID(id: string) {
        return await this.db.findDocumentById(this.db.collections.players, id) as IPlayerWithId;
    }

    public async getAllPlayers() {
        return await this.db.findDocuments(this.db.collections.players) as IPlayerWithId[];
    }

    public async getPlayersById(ids: string[]) {
        return await this.db.findDocumentsById(this.db.collections.players, ids) as IPlayerWithId[];
    }

    public async updatePlayer(id: string, player: Partial<IPlayer>) {
        return await this.db.updateDocument(this.db.collections.players, id, player) as IPlayerWithId;
    }

    public async deletePlayer(id: string) {
        return await this.db.deleteDocument(this.db.collections.players, id);
    }
}

export default PlayerRepository;