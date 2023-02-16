import { Collection } from "mongodb";
import { IPlayerDocument } from "../models/players.model";
import { ISportsCategoryDocument } from "../models/sportsCategory.model";
import { ITournamentDocument } from "../models/tournaments.model";
import { IGameDocument } from "../models/games.model";
import { IPlayerStatsDocument } from "../models/playerStats.model";

export type DocumentTypes = IPlayerDocument | 
                            ISportsCategoryDocument | 
                            ITournamentDocument | 
                            IGameDocument |
                            IPlayerStatsDocument;

export interface IDBCollections {
    users?: Collection,
    sportsCategories?: Collection,
    players?: Collection,
    tournaments?: Collection,
    games?: Collection,
    playerStats?: Collection,
}