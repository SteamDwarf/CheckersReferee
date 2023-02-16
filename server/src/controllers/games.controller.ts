import { NextFunction, Request, Response } from "express";
import { getDBCollections, findDocumentById, updateDocument } from "../database/database";
import { request } from "http";
import { IGameData, IGameDocument } from "../models/games.model";
import { ObjectId } from "mongodb";

export const getGame = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocumentById(getDBCollections().games, id)
    ?.then(game => response.json(game))
    .catch(error => next(error));
}

export const updateGame = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;
    const gameData: IGameData = request.body;

    const gameDocument: IGameDocument = {
        ...gameData,
        player1Id: new ObjectId(gameData.player1Id),
        player2Id: new ObjectId(gameData.player2Id)
    }

    updateDocument(getDBCollections().games, id, gameDocument)
    ?.then(res => response.json(res))
    .catch(error => next(error));
}