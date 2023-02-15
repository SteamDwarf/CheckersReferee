import { NextFunction, Request, Response } from "express"
import { collections, createDocument, deleteDocument, findDocument, findDocuments, updateDocument } from "../database/database";
import { ITournamentData, ITournamentDocument } from "../models/tournaments.model";
import { ObjectId } from "mongodb";
import { shuffle } from "../utils/math";
import { makeRoundRobinDraw } from "../utils/tournaments.utils";
import { Game, IGameData } from "../models/games.model";
import { IPlayerDocument, IPlayerDocumentWithId } from "../models/players.model";

export const getTournaments = (request: Request, response: Response, next: NextFunction) => {
    findDocuments(collections.tournaments)
    ?.then(data => response.json(data))
    .catch(error => next(error));
}
export const getTournament = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocument(collections.tournaments, {"_id": new ObjectId(id)})
    ?.then(data => response.json(data))
    .catch(error => next(error));
}
export const postTournament = (request: Request, response: Response, next: NextFunction) => {
    const tournamentData: ITournamentData = request.body;
    const tournamentDocument: ITournamentDocument = {
        ...tournamentData,
        _id: new ObjectId(tournamentData._id),
        players: tournamentData.players.map(id => new ObjectId(id)),
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
    let tournamentDocument: ITournamentDocument | undefined = undefined;

    findDocument(collections.tournaments, {"_id": new ObjectId(id)})
    ?.then(result  => {
        tournamentDocument = result as ITournamentDocument;
        
        return Promise.all(tournamentDocument.players.map(playerId => findDocument(collections.players, {"_id": new ObjectId(playerId)})));
        //ournament.players = shuffle(tournament.players);
        //tournament.isStarted = true;

        //response.json(makeRoundRobinDraw(tournament.players));
        //tournamentDocument = tournament;

        //return tournament;
    })
    .then(players => {
        const games = makeRoundRobinDraw(players as IPlayerDocumentWithId[]);
        
        return updateDocument(collections.tournaments, id, {games});
        //tournamentDocument ? tournamentDocument.games = games : null;
        //response.json(tournamentDocument);
    })
    .then(() => findDocument(collections.tournaments, {"_id": new ObjectId(id)}))
    .then(result => response.json(result))
    .catch(error => next(error));
}
export const finishTournament = (request: Request, response: Response, next: NextFunction) => {
    response.json("Турнир завершился");
}
