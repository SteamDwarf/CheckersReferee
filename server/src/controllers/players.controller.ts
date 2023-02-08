import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { createDocument, findDocument, findDocuments, deleteDocument, updateDocument, collections } from "../database/database";
import { IPlayerData, IPlayerDocument } from "../models/players.model";


export const createPlayer = (request: Request, response: Response, next: NextFunction) => {
    const playerData: IPlayerData = request.body;
    const playerDocument:IPlayerDocument = {
        ...playerData,
        birthday: new Date(playerData.birthday),
        sportsCategory: new ObjectId(playerData.sportsCategory)
    };

    findDocument(collections.players, {"_id": new ObjectId(playerData.sportsCategory)})
    ?.then(sportCategory => {
        if(!sportCategory) {
            response.status(400);
            throw new Error("Указанный спортивный разряд не найден");
        }

        playerDocument.sportsCategory = new ObjectId(sportCategory?._id);
    })
    .then(() => createDocument(collections.players, playerDocument))
    .then(result => response.json(result))
    .catch(error => next(error))
}

export const getPlayer = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocument(collections.players, {"_id": new ObjectId(id)})
    ?.then(player => response.json(player))
    .catch(error => next(error))
}

export const getPlayers = (request: Request, response: Response, next: NextFunction) => {
    findDocuments(collections.players)
    ?.then(players => response.json(players))
    .catch(error => next(error));
}

export const updatePlayer = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;
    const playerData: IPlayerData = request.body;
    const playerDocument: IPlayerDocument = {
        ...playerData,
        birthday: new Date(playerData.birthday),
        sportsCategory: new ObjectId(playerData.sportsCategory)
    }

    updateDocument(collections.players, id, playerDocument)
    ?.then(res => response.json(res))
    .catch(error => next(error));
}

export const deletePlayer = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    deleteDocument(collections.players, id)
    ?.then(res => response.json(res))
    .catch(error => next(error));
}

