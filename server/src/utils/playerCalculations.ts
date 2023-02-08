import { ObjectId } from "mongodb";
import { getSportCategoryById } from "../controllers/sportsCategories.controller";
import { collections, findDocument } from "../database/database";
import { CollectionNames } from "../database/enums";
import { IPlayerData } from "../models/players.model"
import { ISportsCategoryDocument} from "../models/sportsCategory.model"
import { clamp } from "./math";


export const getNewAdamovichRank = async(player: IPlayerData, competitors: IPlayerData[], score: number, games: number) => {
    const sumCompetitorsRank = competitors.reduce((sum, curCompetitor) => {
        return sum += curCompetitor.currentAdamovichRank;
    }, 0);
    const newRank = (20 * player.currentAdamovichRank + sumCompetitorsRank + 5000/15 * (2 * score - games)) / (20 + games);
    
    return findDocument(collections.sportsCategories, {_id: new ObjectId(player.sportsCategory)})
    ?.then(res => {
        const category = res as ISportsCategoryDocument;

        return clamp(newRank, category.minAdamovichRank, category.maxAdamovichRank);
    })
}

/* export const getDefaultAdamovichRank = (sportCategory: ISportsCategory) => {

}

export const clampAdamovichRank = (sportCategory: ISportsCategory, adamovichRank: number) => {

} */