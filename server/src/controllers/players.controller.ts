import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { createDocument, findDocuments, deleteDocument, updateDocument, getDBCollections, findDocumentById } from "../database/database";
import { IPlayerData, IPlayerDocument } from "../models/players.model";
import { ISportsCategoryDocument } from "../models/sportsCategory.model";
import { paginateData } from "../utils/controllers.utils";

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

    findDocumentById(getDBCollections().sportsCategories, playerData.sportsCategory)
    ?.then(sportCategory => {
        if(!sportCategory) {
            response.status(400);
            throw new Error("Указанный спортивный разряд не найден");
        }
        setSportCategory(sportCategory as ISportsCategoryDocument, playerDocument)
    })
    .then(() => createDocument(getDBCollections().players, playerDocument))
    .then(result => response.json(result))
    .catch(error => next(error))
}

export const getPlayer = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocumentById(getDBCollections().players, id)
    ?.then(player => response.json(player))
    .catch(error => next(error))
}



export const getPlayers = (request: Request<{}, {}, {}, IGetPlayersRequest>, response: Response, next: NextFunction) => {
    const page = request.query.page || "1";
    const limit = request.query.limit || "10";

    findDocuments(getDBCollections().players)
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

    updateDocument(getDBCollections().players, id, playerDocument)
    ?.then(res => response.json(res))
    .catch(error => next(error));
}

export const deletePlayer = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    deleteDocument(getDBCollections().players, id)
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

