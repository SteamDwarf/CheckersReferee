import expressAsyncHandler from "express-async-handler";
import { findDocumentById, findDocumentsById, getDBCollections, updateDocument } from "../database/database"
import { IGameWithId } from "../models/games.model";
import { ITournament, ITournamentWithId } from "../models/tournaments.model";
import { Request, Response } from "express";

export const generateGameResults = expressAsyncHandler(async(request: Request, response: Response) => {
    const tournamentID = request.params.id as string;
    const tournament = await findDocumentById(getDBCollections().tournaments, tournamentID) as ITournamentWithId;
    const lastGamesIDs = tournament.gamesIDs[tournament.gamesIDs.length - 1];
    const updatedGames = [];

    if(lastGamesIDs.length > 0){
        const games = await findDocumentsById(getDBCollections().games, lastGamesIDs as string[]) as IGameWithId[];

        for(let i = 0; i < games?.length; i++) {
            let game = games[i];
            
            if(game.player1ID === "0") {
                game.player2Score = 2;
            } else if(game.player2ID === "0") {
                game.player1Score = 2;
            } else {
                const player1Score = Math.floor(Math.random() * 3);
                const player2Score = 2 - player1Score;

                game.player1Score = player1Score;
                game.player2Score = player2Score;
            }

            game = await updateDocument(getDBCollections().games, game._id.toString(), game) as IGameWithId;
            updatedGames.push(game);
        }
    }

    response.json({games: updatedGames});
})
