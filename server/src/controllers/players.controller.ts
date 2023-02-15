import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { createDocument, findDocuments, deleteDocument, updateDocument, collections, findDocumentById } from "../database/database";
import { IPlayerData, IPlayerDocument } from "../models/players.model";
import { ISportsCategoryDocument } from "../models/sportsCategory.model";
import { paginateData } from "../utils/controllersUtils";

interface IGetPlayersRequest {
    page?: string
    limit?: string
}

export const createPlayer = (request: Request, response: Response, next: NextFunction) => {
    const playerData: IPlayerData = request.body;
    const playerDocument:IPlayerDocument = {
        ...playerData,
        birthday: new Date(playerData.birthday),
        sportsCategory: new ObjectId(playerData.sportsCategory),
        playerStats: playerData.playerStats?.map(id => new ObjectId(id)) || []
    };

    findDocumentById(collections.sportsCategories, playerData.sportsCategory)
    ?.then(sportCategory => {
        if(!sportCategory) {
            response.status(400);
            throw new Error("Указанный спортивный разряд не найден");
        }
        setSportCategory(sportCategory as ISportsCategoryDocument, playerDocument)
    })
    .then(() => createDocument(collections.players, playerDocument))
    .then(result => response.json(result))
    .catch(error => next(error))
}

export const getPlayer = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocumentById(collections.players, id)
    ?.then(player => response.json(player))
    .catch(error => next(error))
}



export const getPlayers = (request: Request<{}, {}, {}, IGetPlayersRequest>, response: Response, next: NextFunction) => {
    const page = request.query.page || "1";
    const limit = request.query.limit || "10";

    findDocuments(collections.players)
    ?.then(players => response.json(paginateData(players, +limit, +page)))
    .catch(error => next(error));
}

export const updatePlayer = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;
    const playerData: IPlayerData = request.body;

    const playerDocument: IPlayerDocument = {
        ...playerData,
        birthday: new Date(playerData.birthday),
        sportsCategory: new ObjectId(playerData.sportsCategory),
        playerStats: playerData.playerStats?.map(id => new ObjectId(id)) || []
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


const setSportCategory = (sportCategory: ISportsCategoryDocument, playerDocument: IPlayerDocument) => {
    const sportCategoryDoc = sportCategory as ISportsCategoryDocument;

    playerDocument.sportsCategory = new ObjectId(sportCategory?._id);
    playerDocument.sportsCategoryAbbr = sportCategoryDoc.shortTitle;
    
    if(!playerDocument.currentAdamovichRank) {
        playerDocument.currentAdamovichRank = sportCategoryDoc.minAdamovichRank;
    }
}

