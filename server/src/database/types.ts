import { Collection, OptionalId } from "mongodb";
import { ISportsCategoryDocument } from "../models/sportsCategory.model";
import { ITournament } from "../models/tournaments.model";
import { IGame } from "../models/games.model";
import { IPlayerStats } from "../models/playerStats.model";
import { IUser } from "../models/users.model";
import { IPlayer } from "../models/players.model";

export type DocumentTypes = IPlayer | 
                            ISportsCategoryDocument | 
                            ITournament | 
                            IGame |
                            IPlayerStats;

export type DBCollections = Collection | Collection<OptionalId<IUser>>;

export interface IDBCollections {
    users?: Collection<OptionalId<IUser>>,
    sportsCategories?: Collection,
    players?: Collection,
    tournaments?: Collection,
    games?: Collection,
    playerStats?: Collection,
}