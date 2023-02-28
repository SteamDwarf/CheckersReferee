import { Request, Response } from "express";
import { getDBCollections, findDocumentById, updateDocument, findDocuments } from "../database/database";
import { IGame} from "../models/games.model";
import expressAsyncHandler from "express-async-handler";
import { NotFoundError } from "../utils/ServerError";


export const getGames = expressAsyncHandler(async(request: Request, response: Response) => {
    const games = await findDocuments(getDBCollections().games);

    response.json(games);
});

export const getGame = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const game = await findDocumentById(getDBCollections().games, id);
    
    response.json(game)
});

export const updateGame = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const gameData: IGame = request.body;
    const gameForUpdate = await findDocumentById(getDBCollections().games, id);

    if(!gameForUpdate) throw new NotFoundError("По указанному id игра не найдена");

    const updatedGame = await updateDocument(getDBCollections().games, id, gameData);

    response.json(updatedGame);
})