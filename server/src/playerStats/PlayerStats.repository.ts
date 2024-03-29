import { inject, injectable } from "inversify";
import BaseRepository from "../common/Base.repository";
import { MAIN } from "../common/injectables.types";
import DataBase from "../DB/DataBase";
import { IPlayerStatsSearchFilter, IPlayerStatsWithID } from "./playerStats.model";
import PlayerStatsPlain from "./PlayerStatsPlain.entity";
import PlayerStatsDocument from "./PlayerStatsDocument.entity";

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

    public async getPlayersStatsByFilter(filter: IPlayerStatsSearchFilter) {
        return await this.db.findDocumentsWithFilter(this.db.collections.playerStats, filter) as IPlayerStatsWithID[];
    }

    public async getPlayersStatsFromTournament(tournamentID: string) {
        return await this.db.findDocumentsWithFilter(this.db.collections.playerStats, {tournamentID}) as IPlayerStatsWithID[] | [];
    }

    /* public async getPlayersStatsFromPlayer(playerID: string) {
        return await this.db.findDocumentsWithFilter(
            this.db.collections.playerStats,
            {playerID},
        ) as IPlayerStatsWithID[]
    } */

    public async getPlayerStatsByID(id: string) {
        return await this.db.findDocumentById(this.db.collections.playerStats, id) as IPlayerStatsWithID | undefined;
    }

    public async getPlayersStatsByIDs(IDs: (string | undefined)[]) {
        const statsPlain = await this.db.findDocumentsById(this.db.collections.playerStats, IDs) as (IPlayerStatsWithID | undefined)[];
        const statsDocuments = [];

        for(let i = 0; i < statsPlain.length; i++) {
            const stat = statsPlain[i];

            if(stat){
                statsDocuments.push(new PlayerStatsDocument(stat));
            }
        }

        return statsDocuments;
    }

    public async deletePlayersStats(IDs: (string | undefined)[]) {
        return await this.db.deleteDocuments(this.db.collections.playerStats, IDs);
    }

    public async deleteAllPlayersStats() {
        return await this.db.deleteAllDocuments(this.db.collections.playerStats);
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