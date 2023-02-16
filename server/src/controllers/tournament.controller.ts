import { NextFunction, Request, Response } from "express"
import { collections, createDocument, deleteDocument, findDocument, findDocumentById, findDocuments, updateDocument } from "../database/database";
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

    findDocuments(collections.tournaments)
    ?.then(data => response.json(paginateData(data, +limit, +page)))
    .catch(error => next(error));
}
export const getTournament = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocumentById(collections.tournaments, id)
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
    
    createDocument(collections.tournaments, tournamentDocument)
    ?.then(data => response.json(data))
    .catch(error => next(error))
}
export const deleteTournament = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    deleteDocument(collections.tournaments, id)
    ?.then(data => response.json(data))
    .catch(error => next(error));
}
export const updateTournament = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;
    const {body} = request;

    updateDocument(collections.tournaments, id, body)
    ?.then(data => response.json(data))
    .catch(error => next(error));
}

//TODO НАВЕСТИ ПОРЯДОК!!!!!
export const startTournament = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;
    let tournamentDocument: ITournamentDocumentWithId;
    let playersDocuments: IPlayerDocumentWithId[];

    findDocumentById(collections.tournaments, id)
    ?.then(result  => {
        tournamentDocument = result as ITournamentDocumentWithId;
        
        return Promise.all(tournamentDocument.players.map(playerId => {
            return findDocument(collections.players, {"_id": new ObjectId(playerId)});
        }));
    })
    .then(players => {
        playersDocuments = players as IPlayerDocumentWithId[];

        return Promise.all(players.map(player => {
            const playserStat = PlayerStat(player as IPlayerDocumentWithId, tournamentDocument);

            return createDocument(collections.playerStats, playserStat);
        }));
    })
    .then(() => {
        const games = makeRoundRobinDraw(playersDocuments as IPlayerDocumentWithId[]);
        return Promise.all(games.map(game => createDocument(collections.games, game)))
    })
    .then(gameDocuments => {
        if(tournamentDocument) {
            tournamentDocument.isStarted = true;
            tournamentDocument.games = gameDocuments.map(game => game?._id);
        }
        return updateDocument(collections.tournaments, id, tournamentDocument);
    })
    .then(result => response.json(result))
    .catch(error => next(error));
}
export const finishTournament = (request: Request, response: Response, next: NextFunction) => {
    response.json("Турнир завершился");
}


