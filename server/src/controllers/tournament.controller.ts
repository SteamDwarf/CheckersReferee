import { NextFunction, Request, Response } from "express"
import { getDBCollections, createDocument, deleteDocument, findDocument, findDocumentById, findDocuments, updateDocument} from "../database/database";
import { ITournamentData, ITournamentDocument, ITournamentDocumentWithId } from "../models/tournaments.model";
import { ObjectId, WithId } from "mongodb";
import { shuffle } from "../utils/math";
import { makeRoundRobinDraw } from "../utils/tournaments.utils";
import { Game, IGameData, IGameDocumentWithId } from "../models/games.model";
import { IPlayerDocument, IPlayerDocumentWithId } from "../models/players.model";
import { paginateData } from "../utils/controllers.utils";
import { PlayerStat } from "../models/playerStats.model";

export const getTournaments = (request: Request, response: Response, next: NextFunction) => {
    const page = request.query.page || "1";
    const limit = request.query.limit || "10";

    findDocuments(getDBCollections().tournaments)
    ?.then(data => response.json(paginateData(data, +limit, +page)))
    .catch(error => next(error));
}
export const getTournament = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocumentById(getDBCollections().tournaments, id)
    ?.then(data => response.json(data))
    .catch(error => next(error));
}
export const postTournament = (request: Request, response: Response, next: NextFunction) => {
    const tournamentData: ITournamentData = request.body;
    const tournamentDocument: ITournamentDocumentWithId = {
        ...tournamentData,
        _id: new ObjectId(tournamentData._id),
        players: tournamentData.players?.map(id => new ObjectId(id)) || [],
        games: []
    }
    
    createDocument(getDBCollections().tournaments, tournamentDocument)
    ?.then(data => response.json(data))
    .catch(error => next(error))
}
export const deleteTournament = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    deleteDocument(getDBCollections().tournaments, id)
    ?.then(data => response.json(data))
    .catch(error => next(error));
}
export const updateTournament = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;
    const {body} = request;

    updateDocument(getDBCollections().tournaments, id, body)
    ?.then(data => response.json(data))
    .catch(error => next(error));
}

//TODO НАВЕСТИ ПОРЯДОК!!!!!
export const startTournament = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;
    let tournamentDocument: ITournamentDocumentWithId;
    let playersDocuments: IPlayerDocumentWithId[];

    findDocumentById(getDBCollections().tournaments, id)
    ?.then(result  => {
        tournamentDocument = result as ITournamentDocumentWithId;
        
        if(tournamentDocument.players.length < 3) {
            response.status(400);
            throw new Error("Для старта турнира нужно как минимум 3 участника");
        }

        return Promise.all(tournamentDocument.players.map(playerId => {
            return findDocument(getDBCollections().players, {"_id": new ObjectId(playerId)});
        }));
    })
    .then(players => {
        playersDocuments = players as IPlayerDocumentWithId[];

        return Promise.all(players.map(player => {
            const playserStat = PlayerStat(player as IPlayerDocumentWithId, tournamentDocument);

            return createDocument(getDBCollections().playerStats, playserStat);
        }));
    })
    .then(() => {
        const games = makeRoundRobinDraw(playersDocuments as IPlayerDocumentWithId[]);
        return Promise.all(games.map(game => createDocument(getDBCollections().games, game)))
    })
    .then(gameDocuments => {
        if(tournamentDocument) {
            tournamentDocument.isStarted = true;
            tournamentDocument.games = gameDocuments.map(game => game?._id);
        }
        return updateDocument(getDBCollections().tournaments, id, tournamentDocument);
    })
    .then(result => response.json(result))
    .catch(error => next(error));
}
export const finishTournament = (request: Request, response: Response, next: NextFunction) => {
    response.json("Турнир завершился");
}


