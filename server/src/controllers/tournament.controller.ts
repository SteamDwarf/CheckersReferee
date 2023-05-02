import { Request, Response } from "express"
import { getDBCollections, 
    createDocument, 
    deleteDocument, 
    findDocumentById, 
    findDocuments, 
    updateDocument, 
    findDocumentsById, 
    createDocuments, 
    findDocumentsWithFilter, 
    updateDocuments
} from "../database/database";
import { ITournament, ITournamentWithId, TournamentSystems } from "../models/tournaments.model";
import { makeRoundRobinDraw, makeSwissDraw } from "../utils/tournaments.utils";
import { IPlayerWithId } from "../models/players.model";
import { paginateData } from "../utils/controllers.utils";
import { IPlayerStats, IPlayerStatsWithID, PlayerStat } from "../models/playerStats.model";
import expressAsyncHandler from "express-async-handler";
import { InputError, NotFoundError } from "../utils/ServerError";
import { calculateAdamovichAfterTournament, calculateGorinCoefficient } from "../utils/player.utils";
import { ISportsCategoryWithID } from "../models/sportsCategory.model";
import { IGameWithId } from "../models/games.model";
import { updatePlayerStatsAfterTournament } from "./playerStats.controller";
import { updatePlayersAfterTournament } from "./players.controller";
import { splitGames } from "../utils/games.utils";

export const getTournaments = expressAsyncHandler(async(request: Request, response: Response) => {
    const page = request.query.page || "1";
    const limit = request.query.limit || "10";
    const tournaments = await findDocuments(getDBCollections().tournaments);

    response.json(paginateData(tournaments || [], +limit, +page))
});

export const getTournament = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const tournament = await findDocumentById(getDBCollections().tournaments, id);

    response.json(tournament);
});

export const postTournament = expressAsyncHandler(async(request: Request, response: Response) => {
    const tournamentData: ITournament = {
        ...request.body,
        playersIDs: request.body.playersIDs || [],
        gamesIDs: request.body.gamesIDs || [],
        playersStatsIDs: []
    };

    const createdTournament = await createDocument(getDBCollections().tournaments, tournamentData);

    response.json(createdTournament);
});
export const deleteTournament = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const tournamentForDeleting = await findDocumentById(getDBCollections().tournaments, id);

    if(!tournamentForDeleting) throw new NotFoundError("По указанному id турнир не найден");

    const deletingResult = await deleteDocument(getDBCollections().tournaments, id);

    response.json(deletingResult);
});

export const updateTournament = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const tournamentData: ITournament = request.body;
    const documentForUpdate = await findDocumentById(getDBCollections().tournaments, id);

    if(!documentForUpdate) throw new NotFoundError("По указанному id турнир не найден");

    const updatedDocument = await updateDocument(getDBCollections().tournaments, id, tournamentData);

    response.json(updatedDocument);
})

//TODO НАВЕСТИ ПОРЯДОК!!!!!
export const startTournament = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const tournamentForStart = await findDocumentById(getDBCollections().tournaments, id) as ITournamentWithId;

    if(!tournamentForStart) throw new NotFoundError("По указанному id турнир не найден");
    if(tournamentForStart.isStarted) throw new InputError("Данный турнир уже стартовал");
    //TODO скорректировать с разными видами систем и жеребьевки
    if(tournamentForStart.playersIDs.length < 3) throw new InputError("Для старта турнира нужно как минимум 3 участника");

    const players = await findPlayers(tournamentForStart.playersIDs as string[]) as IPlayerWithId[];
    const playersStats = players.map(player => PlayerStat(player as IPlayerWithId, id));
    //TODO скорректировать с типом жеребьевки

    makeDraw(tournamentForStart, playersStats);

    const {games, toursCount} = makeRoundRobinDraw(id, playersStats as IPlayerStats[]);
    const savedGames = await createDocuments(getDBCollections().games, games) as IGameWithId[];
    const savedPlayersStats = await createDocuments(getDBCollections().playerStats, playersStats) as IPlayerStatsWithID[];
    const {toursGamesIDs} = splitGames(savedGames, toursCount);
    await saveStatsToPlayers(players, savedPlayersStats);

    tournamentForStart.isStarted = true;
    tournamentForStart.gamesIDs = toursGamesIDs;
    tournamentForStart.playersStatsIDs = savedPlayersStats.map(stat => stat._id.toString());
    
    const updatedTournament = await updateDocument(getDBCollections().tournaments, id, tournamentForStart);

    response.json(updatedTournament);

});


export const finishTournament = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const tournamentForFinish = await findDocumentById(getDBCollections().tournaments, id) as ITournamentWithId;

    if(!tournamentForFinish) throw new NotFoundError("По указанному id турнир не найден");
    if(tournamentForFinish.isFinished) throw new InputError("Данный турнир уже стартовал");

    const playersStats = await findDocumentsWithFilter(getDBCollections().playerStats, {tournamentID: id}) as IPlayerStatsWithID[];
    const games = await findDocumentsWithFilter(getDBCollections().games, {tournamentID: id}) as IGameWithId[];

    const savedPlayerStats = await updatePlayerStatsAfterTournament(playersStats,games) as IPlayerStatsWithID[];
    await updatePlayersAfterTournament(savedPlayerStats);

    tournamentForFinish.isFinished = true;

    const updatedTournament = await updateDocument(getDBCollections().tournaments, tournamentForFinish._id.toString(), tournamentForFinish);

    response.json(updatedTournament);
});

const makeDraw = (tournament: ITournamentWithId, playerStats: IPlayerStats[]) => {
    if(tournament.tournamentSystem === TournamentSystems.round) {
        return makeRoundRobinDraw(tournament._id.toString(), playerStats);
    } 
    if(tournament.tournamentSystem === TournamentSystems.swiss) {
        return makeSwissDraw(tournament._id.toString(), playerStats);
    }
}

const findPlayers = async(playersIDs: string[]) => {
    const players = await findDocumentsById(getDBCollections().players, playersIDs) || [];

    if(players.length < playersIDs.length) {
        throw new NotFoundError(`В базе данных не было найдено ${playersIDs.length - players.length} игрока`)
    }

    return players;
}

//TODO перенести в playerController
const saveStatsToPlayers = async(players: IPlayerWithId[], playerStats: IPlayerStatsWithID[]) => {
    const updatedPlayers = await Promise.all(players.map(async (player) => {
        const playerStat = playerStats.find(stat => stat.playerID === player._id.toString());

        player.playerStatsIDs.push(playerStat?._id.toString() as string);
        return await updateDocument(getDBCollections().players, player._id.toString(), player);
    }));

    return updatedPlayers;
}


/*
    После старта турнира клиент получает обновленные данные турнира и список уже сформированных игр.
    На клиенте можно отобразить так: ФИО1 0:0 ФИО2.
    Добавить кнопку при нажатии на которую можно выбрать победителя или указать ничью
    После этих действий, данные отправляются на сервер для обновления данных game.
    Также нужно обновить данные игрока - очки, место, рейтинг Адамовича.
    Для этого нам нужен отдельный объект playerStats
*/