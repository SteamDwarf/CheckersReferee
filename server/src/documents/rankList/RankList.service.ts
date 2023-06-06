import { inject, injectable } from "inversify";
import { REPOSITORIES, SERVICES } from "../../common/injectables.types";
import TournamentService from "../../tournaments/Tournament.service";
import RankListRepository from "./RankList.repository";
import RankList from "./RankList.entity";

//TODO унаследовать от BaseService
@injectable()
class RankListService {
    constructor(
        @inject(REPOSITORIES.RankList) private readonly _rankListRepository: RankListRepository,
    ){}

    public async getRankList(tournamentID: string) {
        const rankLists = await this._rankListRepository.getRankListByTournamentID(tournamentID);

        if(rankLists.length > 0) {
            return new RankList(rankLists[0]._id, rankLists[0].documentTitle, rankLists[0].tournamentID);
        }
        const createdRankList = await this._rankListRepository.createRankList(tournamentID, `rating-list-${tournamentID}`);
        const rankList = new RankList(createdRankList._id, createdRankList.documentTitle, createdRankList.tournamentID);

        return rankList;
    }
}

export default RankListService;