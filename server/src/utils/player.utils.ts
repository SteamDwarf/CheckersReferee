import { ObjectId } from "mongodb";
import { getSportCategoryById } from "../controllers/sportsCategories.controller";
import { getDBCollections, findDocument, findDocumentById } from "../database/database";
import { IPlayer, IPlayerDocumentWithId } from "../models/players.model"
import { ISportsCategoryDocument} from "../models/sportsCategory.model"
import { clamp } from "./math";
import { IPVersion } from "net";
import { IPlayerStats, IPlayerStatsWithID } from "../models/playerStats.model";


export const getNewAdamovichRank = (playerStats: IPlayerStats, competitorAdamovichRank: number) => {
    /* const sumCompetitorsRank = playersStats.reduce((sum, curPlayerStats) => {
        if(playerStats.playerID !== curPlayerStats.playerID) {
            return sum += curPlayerStats.startAdamovichRank;
        }

        return sum;
    }, 0); */
    //TODO брать startAdamovichRank или lastAdamovichRank
    const newRank = (20 * playerStats.startAdamovichRank + competitorAdamovichRank + 5000/15 * (playerStats.score - 1)) / 21;

    return newRank;
}

/* export const getNewAdamovichRank = async(player: IPlayer, competitors: IPlayer[], score: number, games: number) => {
    const sumCompetitorsRank = competitors.reduce((sum, curCompetitor) => {
        return sum += curCompetitor.currentAdamovichRank;
    }, 0);
    const newRank = (20 * player.currentAdamovichRank + sumCompetitorsRank + 5000/15 * (2 * score - games)) / (20 + games);
    
    return findDocumentById(getDBCollections().sportsCategories, player.sportsCategoryID)
            ?.then(category => clampAdamovichRank(category as ISportsCategoryDocument, newRank));
} */

export const clampAdamovichRank = (sportCategory: ISportsCategoryDocument, newRank: number) => {
    return clamp(newRank, sportCategory.minAdamovichRank, sportCategory.maxAdamovichRank);
}

export const getPlayerName = (player: {firstName: string, middleName: string, lastName: string}) => {
    return [player.firstName, player.middleName, player.lastName].join(" ").trim();
}