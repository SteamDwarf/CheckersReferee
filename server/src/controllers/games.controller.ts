import { Request, Response } from "express";
import { getDBCollections, findDocumentById, updateDocument, findDocuments, findDocumentsWithFilter} from "../database/database";
import { IGameWithId} from "../models/games.model";
import expressAsyncHandler from "express-async-handler";
import { NotFoundError } from "../utils/ServerError";
import { IPlayerStatsWithID } from "../models/playerStats.model";
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

export const updateGame = expressAsyncHandler(async(request: Request, response: Response) => {
    const gameID = request.params.id;
    const newGameData: IGameWithId = request.body;
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
    
    const savedGame = await updateDocument(getDBCollections().games, gameID, newGameData) as IGameWithId;

    response.json(savedGame);
});