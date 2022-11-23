import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { createDocument, findDocument, findDocuments } from "../database/database";
import { CollectionNames } from "../database/enums";
import { IPlayer, IPlayerData, IPlayerDocument } from "../models/players.model";


export const createPlayer = (request: Request, response: Response, next: NextFunction) => {
    const playerData: IPlayerData = request.body;
    const playerDocument:IPlayerDocument = {
        ...playerData,
        birthday: new Date(playerData.birthday),
        sportsCategory: new ObjectId(playerData.sportsCategory)
    };

    findDocument(CollectionNames.SPORTS_CATEGORIES, {"_id": new ObjectId(playerData.sportsCategory)})
    ?.then(sportCategory => {
        if(!sportCategory) {
            response.status(400);
            throw new Error("Указанный спортивный разряд не найден");
        }

        playerDocument.sportsCategory = new ObjectId(sportCategory?._id);
    })
    .then(() => createDocument(CollectionNames.PLAYERS, playerDocument))
    .then(result => response.json(result))
    .catch(error => next(error))
}

export const getPlayer = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocument(CollectionNames.PLAYERS, {"_id": new ObjectId(id)})
    ?.then(player => response.json(player))
    .catch(error => next(error))
}

export const getPlayers = (request: Request, response: Response, next: NextFunction) => {
    findDocuments(CollectionNames.PLAYERS)
    ?.then(players => response.json(players))
    .catch(error => next(error));
}

export const updatePlayer = (request: Request, response: Response) => {

}

export const deletePlayer = (request: Request, response: Response) => {

}

