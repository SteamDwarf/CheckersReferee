import { Collection, ObjectId, OptionalId } from "mongodb";
import { ISportsCategory } from "../models/sportsCategory.model";
import { ITournament } from "../models/tournaments.model";
import { IGame } from "../games/games.model";
import { IPlayerStats } from "../playerStats/playerStats.model";
import { IUser } from "../auth/users.model";
import { IPlayer } from "../players/players.model";
import { IRankList, IRankListWithID } from "../documents/rankList/RankList.scheme";

export type DocumentTypes = IPlayer | 
                            ISportsCategory | 
                            ITournament | 
                            IGame |
                            IPlayerStats |
                            IRankList

export type DBCollections = Collection | Collection<OptionalId<IUser>>;

export interface IDBCollections {
    users?: Collection<OptionalId<IUser>>,
    sportsCategories?: Collection,
    players?: Collection,
    tournaments?: Collection,
    games?: Collection,
    playerStats?: Collection,
    rankLists?: Collection,
}

export interface DocumentWithID {
    _id: ObjectId
}