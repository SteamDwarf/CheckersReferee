import { inject, injectable } from "inversify";
import BaseRepository from "../../common/Base.repository";
import { MAIN } from "../../common/injectables.types";
import DataBase from "../../DB/DataBase";
import RankList from "./RankList.entity";
import { IRankListWithID } from "./RankList.scheme";

@injectable()
class RankListRepository extends BaseRepository{
    constructor(
        @inject(MAIN.Database) database: DataBase
    ) {
        super(database);
    }

    public async createRankList(tournamentID: string, documentTitle: string) {
        return await this.db.createDocument(this.db.collections.rankLists, {
            tournamentID,
            documentTitle
        }) as IRankListWithID;
    }

    public async getRankListByID(id: string) {
        return await this.db.findDocumentById(this.db.collections.rankLists, id) as IRankListWithID;
    }
    public async getRankListByTournamentID(tournamentID: string) {
        return await this.db.findDocumentsWithFilter(this.db.collections.rankLists, {tournamentID}) as IRankListWithID[];
    }
}

export default RankListRepository;