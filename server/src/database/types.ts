import { Collection, OptionalId } from "mongodb";
import { IPlayerDocument } from "../models/players.model";
import { ISportsCategoryDocument } from "../models/sportsCategory.model";
import { ITournamentDocument } from "../models/tournaments.model";
import { IGameDocument } from "../models/games.model";
import { IPlayerStatsDocument } from "../models/playerStats.model";
import { IUser } from "../models/users.model";

export type DocumentTypes = IPlayerDocument | 
                            ISportsCategoryDocument | 
                            ITournamentDocument | 
                            IGameDocument |
                            IPlayerStatsDocument;

export type DBCollections = Collection | Collection<OptionalId<IUser>>;

export interface IDBCollections {
    users?: Collection<OptionalId<IUser>>,
    sportsCategories?: Collection,
    players?: Collection,
    tournaments?: Collection,
    games?: Collection,
    playerStats?: Collection,
}