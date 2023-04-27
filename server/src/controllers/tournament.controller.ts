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
import { ITournament, ITournamentWithId } from "../models/tournaments.model";
import { makeRoundRobinDraw } from "../utils/tournaments.utils";
import { IPlayerWithId } from "../models/players.model";
import { paginateData } from "../utils/controllers.utils";
import { IPlayerStats, IPlayerStatsWithID, PlayerStat } from "../models/playerStats.model";
import expressAsyncHandler from "express-async-handler";
import { InputError, NotFoundError } from "../utils/ServerError";
import { calculateAdamovichAfterTournament, calculateGorinCoefficient } from "../utils/player.utils";
import { ISportsCategoryWithID } from "../models/sportsCategory.model";
import { IGameWithId } from "../models/games.model";

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
    const games = makeRoundRobinDraw(id, playersStats as IPlayerStats[]);
    const savedGames = await createDocuments(getDBCollections().games, games) || [];
    const savedPlayersStats = await createDocuments(getDBCollections().playerStats, playersStats) as IPlayerStatsWithID[];

    await saveStatsToPlayers(players, savedPlayersStats);

    tournamentForStart.isStarted = true;
    tournamentForStart.gamesIDs = savedGames.map(game => game?._id.toString());
    tournamentForStart.playersStatsIDs = savedPlayersStats.map(stat => stat._id.toString());
    
    const updatedTournament = await updateDocument(getDBCollections().tournaments, id, tournamentForStart);

    response.json(updatedTournament);

});


export const finishTournament = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const tournamentForFinish = await findDocumentById(getDBCollections().tournaments, id) as ITournamentWithId;

    if(!tournamentForFinish) throw new NotFoundError("По указанному id турнир не найден");

    const games = await findDocumentsWithFilter(getDBCollections().games, {tournamentID: id}) as IGameWithId[];
    let playersStats = await findDocumentsWithFilter(getDBCollections().playerStats, {tournamentID: id}) as IPlayerStatsWithID[];
    
    
    playersStats = playersStats.sort((stat1, stat2) => (stat1.score - stat2.score) * -1);

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
    //TODO обновить рейтинг у модели игрока
    //TODO обновить isFinished

    const savedPlayerStats = await updateDocuments(getDBCollections().playerStats, playersStats);

    /* const savedPlayerStats = await playersStats.map(async playerStats => {
        return await updateDocument(getDBCollections().playerStats, playerStats._id.toString(), playerStats);
    })
 */

    response.json("Турнир завершился");
});

const findPlayers = async(playersIDs: string[]) => {
    const players = await findDocumentsById(getDBCollections().players, playersIDs) || [];

    if(players.length < playersIDs.length) {
        throw new NotFoundError(`В базе данных не было найдено ${playersIDs.length - players.length} игрока`)
    }

    return players;
}

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