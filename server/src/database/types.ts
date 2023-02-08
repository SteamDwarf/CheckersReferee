import { Collection } from "mongodb";
import { IPlayerDocument } from "../models/players.model";
import { ISportsCategoryDocument } from "../models/sportsCategory.model";
import { ITournamentDocument } from "../models/tournaments.model";

export type DocumentTypes = IPlayerDocument | ISportsCategoryDocument | ITournamentDocument;

export interface IDBCollections {
    users?: Collection,
    sportsCategories?: Collection,
    players?: Collection,
    tournaments?: Collection,
}