import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { findDocumentById, findDocuments, findDocumentsWithFilter, getDBCollections, updateDocument, updateDocuments } from "../database/database";
import { IPlayerStats, IPlayerStatsWithID } from "../models/playerStats.model";
import { calculateAdamovichAfterGame, calculateAdamovichAfterTournament, calculateGorinCoefficient } from "../utils/player.utils";
import { IGame } from "../models/games.model";
import { ISportsCategoryWithID } from "../models/sportsCategory.model";

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

export const updatePlayerStatsAfterTournament = async(oldPlayersStats: IPlayerStatsWithID[],  games: IGame[]) => {
    let playersStats = oldPlayersStats.sort((stat1, stat2) => (stat1.score - stat2.score) * -1);

    for(let i = 0; i < playersStats.length; i++) {
        const sportCategory = await findDocumentById(getDBCollections().sportsCategories, playersStats[i].sportsCategoryID) as ISportsCategoryWithID;
        const playerGames = games.filter(game => game.player1ID === playersStats[i].playerID || game.player2ID === playersStats[i].playerID);
        
        playersStats[i].place = i + 1;
        playersStats[i].lastAdamovichRank = calculateAdamovichAfterTournament(playersStats[i], sportCategory, playersStats);
        playersStats[i].gorinRank = calculateGorinCoefficient(playersStats[i].playerID, playerGames, playersStats);
    }

    playersStats = playersStats.map(stat => {
        stat.startAdamovichRank = stat.lastAdamovichRank;
        return stat;
    });

    return updateDocuments(getDBCollections().playerStats, playersStats);
}