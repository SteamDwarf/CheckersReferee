import { Request, Response } from "express";
import { getDBCollections, findDocumentById, updateDocument, findDocuments, findDocumentsWithFilter, findDocument, deleteDocuments} from "../database/database";
import { IGame, IGameWithId} from "../models/games.model";
import expressAsyncHandler from "express-async-handler";
import { NotFoundError } from "../utils/ServerError";
import { IPlayerStatsWithID } from "../models/playerStats.model";
import { updatePlayerStatsAfterGame } from "./playerStats.controller";
import { ITournamentWithId } from "../models/tournaments.model";


export const getGames = expressAsyncHandler(async(request: Request, response: Response) => {
    const tournamentID = request.query.tournamentID;
    const tournamentGames: IGameWithId[][] = [];

    if(tournamentID) {
        const tournament = await findDocumentById(getDBCollections().tournaments, tournamentID.toString()) as ITournamentWithId;

        if(!tournament) throw new NotFoundError("Турнир с указанным id не найден");

        const tours = tournament.gamesIDs;
        console.log(tours);
        for(let i = 0; i < tours.length; i++) {
            const tour = tours[i];
            const findedGames = await Promise.all(tour.map(gameID => findDocumentById(getDBCollections().games, gameID as string))) as IGameWithId[];

            tournamentGames.push(findedGames);
        }

        response.json(tournamentGames);

    } else {
        const games = await findDocuments(getDBCollections().games) as IGameWithId[];
        response.json(games);
    }   

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