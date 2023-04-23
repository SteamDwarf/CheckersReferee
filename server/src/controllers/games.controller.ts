import { NextFunction, Request, Response } from "express";
import { getDBCollections, findDocumentById, updateDocument, findDocuments, findDocumentsWithFilter, findDocument } from "../database/database";
import { IGame, IGameDocumentWithId} from "../models/games.model";
import expressAsyncHandler from "express-async-handler";
import { NotFoundError } from "../utils/ServerError";
import { IPlayerStatsWithID } from "../models/playerStats.model";
import { getNewAdamovichRank } from "../utils/player.utils";
import { updatePlayerStatsAfterGame } from "./playerStats.controller";


export const getGames = expressAsyncHandler(async(request: Request, response: Response) => {
    const tournamentID = request.query.tournamentID;
    let games;

    if(tournamentID) {
        games = await findDocumentsWithFilter(getDBCollections().games, {tournamentID});
    } else {
        games = await findDocuments(getDBCollections().games);
    }   

    response.json(games);
});

export const getGame = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const game = await findDocumentById(getDBCollections().games, id);
    
    response.json(game)
});


/* export const updateGame = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const gameData: IGame = request.body;
    const gameForUpdate = await findDocumentById(getDBCollections().games, id);

    if(!gameForUpdate) throw new NotFoundError("По указанному id игра не найдена");

    const updatedGame = await updateDocument(getDBCollections().games, id, gameData);

    response.json(updatedGame);
}) */

export const updateGame = expressAsyncHandler(async(request: Request, response: Response) => {
    const gameID = request.params.id;
    const newGameData: IGameDocumentWithId = request.body;
    const oldGameData = await findDocumentById(getDBCollections().games, gameID);

    if(!oldGameData) throw new NotFoundError("По указанному id игра не найдена");

    const playersStats = await findDocumentsWithFilter(getDBCollections().playerStats, {tournamentID: oldGameData.tournamentID}) as IPlayerStatsWithID[];
    const player1Stats = playersStats.find(playerStats => {
        return playerStats.playerID === oldGameData.player1ID && playerStats.tournamentID === oldGameData.tournamentID;
    })
    const player2Stats = playersStats.find(playerStats => {
        return playerStats.playerID === oldGameData.player2ID && playerStats.tournamentID === oldGameData.tournamentID;
    })
    
    await updatePlayerStatsAfterGame(player1Stats, player2Stats?.startAdamovichRank, oldGameData.player1Score, newGameData.player1Score);
    await updatePlayerStatsAfterGame(player2Stats, player1Stats?.startAdamovichRank, oldGameData.player2Score, newGameData.player2Score);
    
    const savedGame = await updateDocument(getDBCollections().games, gameID, newGameData) as IGameDocumentWithId;

    response.json(savedGame);
});