import { inject, injectable } from "inversify";
import BaseRepository from "../common/Base.repository";
import { MAIN } from "../common/injectables.types";
import DataBase from "../DB/DataBase";
import { IPlayerStatsWithID } from "./playerStats.model";
import PlayerStatsPlain from "./PlayerStatsPlain.entity";

@injectable()
class PlayerStatsRepository extends BaseRepository{
    constructor(
        @inject(MAIN.Database) database: DataBase
    ){
        super(database);
    }

    public async getAllPlayersStats() {
        return await this.db.findDocuments(this.db.collections.playerStats) as IPlayerStatsWithID[];
    }

    public async getPlayersStatsFromTournament(tournamentID: string) {
        return await this.db.findDocumentsWithFilter(this.db.collections.playerStats, {tournamentID}) as IPlayerStatsWithID[] | [];
    }

    public async getPlayerStatsByID(id: string) {
        return await this.db.findDocumentById(this.db.collections.playerStats, id) as IPlayerStatsWithID | undefined;
    }

    public async deletePlayersStats() {
        return await this.db.deleteDocuments(this.db.collections.playerStats);
    }

    public async createPlayerStats(playerStats: PlayerStatsPlain) {
        return await this.db.createDocument(this.db.collections.playerStats, playerStats) as IPlayerStatsWithID;
    }

    public async createPlayersStats(playersStats: PlayerStatsPlain[]) {
        return await this.db.createDocuments(this.db.collections.playerStats, playersStats) as IPlayerStatsWithID[];
    }

    public async updatePlayerStats(id: string, playerStats: PlayerStatsPlain) {
        return await this.db.updateDocument(this.db.collections.playerStats, id, playerStats) as IPlayerStatsWithID;
    }
}

export default PlayerStatsRepository;