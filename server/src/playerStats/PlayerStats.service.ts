import { deleteDocuments, findDocumentById, findDocuments, getDBCollections } from "../database/database";
import { IPlayerStatsWithID } from "./playerStats.model";

class PlayerStatsService {
    public async getPlayersStats (){
        return await findDocuments(getDBCollections().playerStats) as IPlayerStatsWithID[];
    }

    public async getPlayerStatsByID (id: string) {
        return await findDocumentById(getDBCollections().playerStats, id) as IPlayerStatsWithID;
    }

    public async deletePlayersStats (){
        return await deleteDocuments(getDBCollections().playerStats);
    }
}

export default PlayerStatsService;