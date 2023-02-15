import { Collection } from "mongodb";
import { IPlayerDocument } from "../models/players.model";
import { ISportsCategoryDocument } from "../models/sportsCategory.model";
import { ITournamentDocument } from "../models/tournaments.model";
import { IGameDocument } from "../models/games.model";

export type DocumentTypes = IPlayerDocument | ISportsCategoryDocument | ITournamentDocument | IGameDocument;

export interface IDBCollections {
    users?: Collection,
    sportsCategories?: Collection,
    players?: Collection,
    tournaments?: Collection,
    games?: Collection
}