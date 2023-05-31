import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { deleteDocuments, findDocumentById, findDocuments, findDocumentsWithFilter, getDBCollections, updateDocument, updateDocuments } from "../database/database";
import { IPlayerStats, IPlayerStatsWithID } from "../playerStats/playerStats.model";
import { calculateAdamovichAfterGame, calculateAdamovichAfterTournament, calculateGorinRank } from "../utils/player.utils";
import { IGame } from "../games/games.model";
import { ISportsCategoryWithID } from "../models/sportsCategory.model";
import { compareByScore } from "../utils/playerStats.utils";

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
        /* console.log(prevScore);
        console.log(curScore);
        console.log(playerStats.score); */
        playerStats.score = playerStats.score - prevScore + curScore;

        
        if(competitorAdamovichRank && Math.abs(playerStats.startAdamovichRank - competitorAdamovichRank) < 400) {
            playerStats.lastAdamovichRank = calculateAdamovichAfterGame(playerStats, competitorAdamovichRank);
            playerStats.lastAdamovichTimeStamp = Date.now();
        }
        

       await updateDocument(getDBCollections().playerStats, playerStats._id.toString(), playerStats);

    }
};

export const updatePlayerStatsAfterTournament = async(playersStats: IPlayerStatsWithID[],  games: IGame[]) => {
    for(let i = 0; i < playersStats.length; i++) {
        const sportCategory = await findDocumentById(getDBCollections().sportsCategories, playersStats[i].sportsCategoryID) as ISportsCategoryWithID;
        const playerGames = games.filter(game => game.player1StatsID === playersStats[i]._id.toString() || game.player2StatsID === playersStats[i]._id.toString());
        
        playersStats[i].lastAdamovichRank = calculateAdamovichAfterTournament(playersStats[i], sportCategory, playersStats);
        playersStats[i].gorinRank = calculateGorinRank(playersStats[i]._id.toString(), playerGames, playersStats);
    }

    playersStats.sort(compareByScore);
    playersStats = playersStats.map((stat, i) => {
        stat.place = i + 1;
        stat.startAdamovichRank = stat.lastAdamovichRank;
        return stat;
    });

    return updateDocuments(getDBCollections().playerStats, playersStats);
}

export const deletePlayersStats = expressAsyncHandler(async(request: Request, response: Response) => {
    const result = await deleteDocuments(getDBCollections().playerStats);

    response.json(result);
});
