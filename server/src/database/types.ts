import { Collection } from "mongodb";
import { IPlayerDocument } from "../models/players.model";
import { ISportsCategoryDocument } from "../models/sportsCategory.model";

export type DocumentTypes = IPlayerDocument | ISportsCategoryDocument;

export interface IDBCollections {
    users?: Collection,
    sportsCategories?: Collection,
    players?: Collection
}