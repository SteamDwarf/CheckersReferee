import { Request, Response } from "express";
import { createDocument, findDocuments, deleteDocument, updateDocument, getDBCollections, findDocumentById } from "../database/database";
import { IPlayer} from "../models/players.model";
import { ISportsCategoryDocument } from "../models/sportsCategory.model";
import { paginateData } from "../utils/controllers.utils";
import expressAsyncHandler from "express-async-handler";
import {NotFoundError} from "../utils/ServerError";


export const createPlayer = expressAsyncHandler(async(request: Request, response: Response) => {
    let playerData: IPlayer = request.body;
    const sportCategory = await findDocumentById(getDBCollections().sportsCategories, playerData.sportsCategoryID);

    if(!sportCategory) throw new NotFoundError("По указанному id спортивный разряд не найден");
    
    playerData = setSportCategory(sportCategory as ISportsCategoryDocument, playerData);

    const createdPlayer = await createDocument(getDBCollections().players, playerData);

    response.json(createdPlayer);
})

export const getPlayer = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const player = await findDocumentById(getDBCollections().players, id);

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
    const playerData: IPlayer = request.body;
    const playerForUpdate = await findDocumentById(getDBCollections().players, id);

    if(!playerForUpdate) throw new NotFoundError("По указанному id игрок не найден");

    const updatedPlayer = await updateDocument(getDBCollections().players, id, playerData);

    response.json(updatedPlayer);
});

export const deletePlayer = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const playerForDelete = await findDocumentById(getDBCollections().players, id);

    if(!playerForDelete) throw new NotFoundError("По указанному id игрок не найден");

    const deletingResult = await deleteDocument(getDBCollections().players, id);

    response.json(deletingResult);
});


const setSportCategory = (sportCategory: ISportsCategoryDocument, playerDocument: IPlayer) => {
    const playerCopy = {...playerDocument};

    playerCopy.sportsCategoryID = sportCategory._id.toString();
    playerCopy.sportsCategoryAbbr = sportCategory.shortTitle;
    
    if(!playerCopy.currentAdamovichRank) {
        playerCopy.currentAdamovichRank = sportCategory.minAdamovichRank;
    }

    return playerCopy;
}

