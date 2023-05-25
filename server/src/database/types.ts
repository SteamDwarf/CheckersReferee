import { Collection, ObjectId, OptionalId } from "mongodb";
import { ISportsCategory } from "../models/sportsCategory.model";
import { ITournament } from "../models/tournaments.model";
import { IGame } from "../models/games.model";
import { IPlayerStats } from "../playerStats/playerStats.model";
import { IUser } from "../auth/users.model";
import { IPlayer } from "../players/players.model";

export type DocumentTypes = IPlayer | 
                            ISportsCategory | 
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

export interface DocumentWithID {
    _id: ObjectId
}