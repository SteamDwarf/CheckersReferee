import { NextFunction, Request, Response, Router } from "express";
import PlayerSertificatePlain from "../documents/PlayerSertificatePlain.entity";
import PlayerSertificateOptions from "../documents/documentOptions/PlayerSertificate.options";
import { IPlayer } from "../players/players.model";
import { ISportsCategory } from "../sportsCategory/sportsCategory.model";
import { ITournament } from "../tournaments/tournaments.model";
import { IGame } from "../games/games.model";
import { IPlayerStats } from "../playerStats/playerStats.model";
import { Collection, ObjectId, OptionalId } from "mongodb";
import { IUserWithID } from "../auth/users.model";
import RankList from "../documents/RankList.entity";


export type RouterMethod = keyof Pick<Router, 'get' | 'post' | 'put' | 'delete'>;
export type RequestHandlerAsync = (req: Request, resp: Response, next: NextFunction) => Promise<void>;
export type RequestHandler = (req: Request, resp: Response, next: NextFunction) => void;
export type DocumentsType = PlayerSertificatePlain | RankList;
export type DocumentsOptions = typeof PlayerSertificateOptions;

//TODO убрать ненужное
export type DocumentTypes = IPlayer | 
                            ISportsCategory | 
                            ITournament | 
                            IGame |
                            IPlayerStats

export type DBCollections = Collection | Collection<OptionalId<IUserWithID>>;

export interface IDBCollections {
    users?: Collection<OptionalId<IUserWithID>>,
    sportsCategories?: Collection,
    players?: Collection,
    tournaments?: Collection,
    games?: Collection,
    playerStats?: Collection,
}

export interface DocumentWithID {
    _id: ObjectId
}

/* export interface IRequest extends Request {
    user: {login: string};
} */