import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { findDocumentById, findDocuments, findDocumentsWithFilter, getDBCollections, updateDocument } from "../database/database";
import { IPlayerStatsWithID } from "../models/playerStats.model";
import { calculateAdamovichAfterGame } from "../utils/player.utils";

export const getPlayersStats = expressAsyncHandler(async(request: Request, response: Response) => {
    const tournamentID = request.query.tournamentID;
    const playerID = request.query.playerID;
    let playersStats;

    if(tournamentID) {
        playersStats = await findDocumentsWithFilter(getDBCollections().playerStats, {tournamentID});
    } else if(playerID) {
        playersStats = await findDocumentsWithFilter(getDBCollections().playerStats, {playerID});
    } else {
        playersStats = await findDocuments(getDBCollections().playerStats);
    }

    response.json(playersStats);
})

export const getPlayerStatsByID = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const playerStats = await findDocumentById(getDBCollections().playerStats, id);

    response.json(playerStats);
})

export const updatePlayerStatsAfterGame = async(
        playerStats: IPlayerStatsWithID | undefined, 
        competitorAdamovichRank: number | undefined, 
        prevScore: number, 
        curScore: number
    ) => {

    if(playerStats) {
        playerStats.score = playerStats.score - prevScore + curScore;

        
        if(competitorAdamovichRank && Math.abs(playerStats.startAdamovichRank - competitorAdamovichRank) < 400) {
            playerStats.lastAdamovichRank = calculateAdamovichAfterGame(playerStats, competitorAdamovichRank);
            playerStats.lastAdamovichTimeStamp = Date.now();
        }
        

        await updateDocument(getDBCollections().playerStats, playerStats._id.toString(), playerStats);
    }
};