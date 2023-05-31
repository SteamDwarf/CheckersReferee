import { Request, Response } from "express";
import { getDBCollections, findDocumentById, updateDocument, findDocuments, findDocumentsWithFilter, findDocument, deleteDocuments} from "../database/database";
import { IGame, IGameWithId} from "../games/games.model";
import expressAsyncHandler from "express-async-handler";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import { updatePlayerStatsAfterGame } from "./playerStats.controller";
import { NotFoundError } from "../errors/NotFound.error";


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
    const newGameData: IGame = request.body;
    const oldGameData = await findDocumentById(getDBCollections().games, gameID) as IGameWithId;
    //const tournament = await findDocumentById(getDBCollections().tournaments, newGameData.tournamentID) as ITournamentWithId;
    /* const playerStats = await findDocumentsWithFilter(getDBCollections().playerStats, {
        tournamentID: newGameData.tournamentID
    }) as IPlayerStatsWithID[]; */

    if(!oldGameData) throw new NotFoundError("По указанному id игра не найдена");

    const player1Stats = await findDocumentById(getDBCollections().playerStats, oldGameData.player1StatsID) as IPlayerStatsWithID;
    const player2Stats = await findDocumentById(getDBCollections().playerStats, oldGameData.player2StatsID) as IPlayerStatsWithID;

    await updatePlayerStatsAfterGame(player1Stats, player2Stats?.startAdamovichRank, oldGameData.player1Score, newGameData.player1Score);
    await updatePlayerStatsAfterGame(player2Stats, player1Stats?.startAdamovichRank, oldGameData.player2Score, newGameData.player2Score);
    
    const savedGame = await updateDocument(getDBCollections().games, gameID, newGameData) as IGameWithId;

    /* if(tournament.tournamentSystem === TournamentSystems.swiss) {
        makeNextSwissDraw(tournament, playerStats);
    } */

    response.json(savedGame);
});

export const deleteGames = expressAsyncHandler(async(request: Request, response: Response) => {
    const result = await deleteDocuments(getDBCollections().games);

    response.json(result);
});