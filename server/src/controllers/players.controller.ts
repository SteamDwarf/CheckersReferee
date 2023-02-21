import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { createDocument, findDocuments, deleteDocument, updateDocument, getDBCollections, findDocumentById } from "../database/database";
import { IPlayerData, IPlayerDocument } from "../models/players.model";
import { ISportsCategoryDocument } from "../models/sportsCategory.model";
import { paginateData } from "../utils/controllers.utils";
import expressAsyncHandler from "express-async-handler";
import { ErrorNames, NotFoundError, ServerError } from "../utils/ServerError";

export const createPlayer = expressAsyncHandler(async(request: Request, response: Response) => {
    const playerData: IPlayerData = request.body;
    const sportCategory = await findDocumentById(getDBCollections().sportsCategories, playerData.sportsCategory);

    if(!sportCategory) throw new NotFoundError("Указанный спортивный разряд не найден");

    let playerDocument:IPlayerDocument = {
        ...playerData,
        sportsCategory: new ObjectId(playerData.sportsCategory),
        playerStats: playerData.playerStats?.map(id => new ObjectId(id)) || []
    };
    
    playerDocument = setSportCategory(sportCategory as ISportsCategoryDocument, playerDocument);

    const createdPlayer = await createDocument(getDBCollections().players, playerDocument);

    response.json(createdPlayer);
})

export const getPlayer = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const player = await findDocumentById(getDBCollections().players, id);

    if(!player) throw new NotFoundError("По указанному id не был найден игрок");

    response.json(player);
})



export const getPlayers = expressAsyncHandler(async(request: Request, response: Response) => {
    const page = request.query.page || "1";
    const limit = request.query.limit || "10";
    const players = await findDocuments(getDBCollections().players) || [];

    response.json(paginateData(players, +limit, +page));
});

export const updatePlayer = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const playerData: IPlayerData = request.body;
    const playerForUpdate = await findDocumentById(getDBCollections().players, id);

    if(!playerForUpdate) throw new NotFoundError("По указанному id игрок не найден");

    const playerDocument: IPlayerDocument = {
        ...playerData,
        sportsCategory: new ObjectId(playerData.sportsCategory),
        playerStats: playerData.playerStats?.map(id => new ObjectId(id)) || []
    }
    const updatedPlayer = await updateDocument(getDBCollections().players, id, playerDocument);

    response.json(updatedPlayer);
});

export const deletePlayer = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const playerForDelete = await findDocumentById(getDBCollections().players, id);

    if(!playerForDelete) throw new NotFoundError("По указанному id игрок не найден");

    const deletingResult = await deleteDocument(getDBCollections().players, id);

    response.json(deletingResult);
});


const setSportCategory = (sportCategory: ISportsCategoryDocument, playerDocument: IPlayerDocument) => {
    const playerCopy = {...playerDocument};

    playerCopy.sportsCategory = sportCategory._id;
    playerCopy.sportsCategoryAbbr = sportCategory.shortTitle;
    
    if(!playerCopy.currentAdamovichRank) {
        playerCopy.currentAdamovichRank = sportCategory.minAdamovichRank;
    }

    return playerCopy;
}

