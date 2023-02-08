import { NextFunction, Request, Response } from "express"
import { collections, createDocument, deleteDocument, findDocument, findDocuments, updateDocument } from "../database/database";
import { ITournamentData, ITournamentDocument } from "../models/tournaments.model";
import { ObjectId } from "mongodb";

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
export const startTournament = (request: Request, response: Response, next: NextFunction) => {
    response.json("Турнир стартовал");
}
export const finishTournament = (request: Request, response: Response, next: NextFunction) => {
    response.json("Турнир завершился");
}
