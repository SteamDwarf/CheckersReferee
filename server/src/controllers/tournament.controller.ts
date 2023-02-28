import { NextFunction, Request, Response } from "express"
import { getDBCollections, createDocument, deleteDocument, findDocumentById, findDocuments, updateDocument, findDocumentsById, createDocuments} from "../database/database";
import { ITournament, ITournamentDocumentWithId } from "../models/tournaments.model";
import { ObjectId, WithId } from "mongodb";
import { shuffle } from "../utils/math";
import { makeRoundRobinDraw } from "../utils/tournaments.utils";
import { IGame, IGameDocumentWithId } from "../models/games.model";
import { IPlayerDocumentWithId } from "../models/players.model";
import { paginateData } from "../utils/controllers.utils";
import { IPlayerStats, PlayerStat } from "../models/playerStats.model";
import expressAsyncHandler from "express-async-handler";
import { InputError, NotFoundError } from "../utils/ServerError";

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
        gamesIDs: request.body.gamesIDs || []
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
    const tournamentForStart = await findDocumentById(getDBCollections().tournaments, id) as ITournamentDocumentWithId;

    if(!tournamentForStart) throw new NotFoundError("По указанному id турнир не найден");
    if(tournamentForStart.isStarted) throw new InputError("Данный турнир уже стартовал");
    //TODO скорректировать с разными видами систем и жеребьевки
    if(tournamentForStart.playersIDs.length < 3) throw new InputError("Для старта турнира нужно как минимум 3 участника");


    const players = await findDocumentsById(getDBCollections().players, tournamentForStart.playersIDs as string[]) || [];

    if(players.length < tournamentForStart.playersIDs.length) {
        throw new NotFoundError(`В базе данных не было найдено ${tournamentForStart.playersIDs.length - players.length} игрока`)
    }


    //TODO для каждого игрока сформировать статистику
    const playersStats = players.map(player => PlayerStat(player as IPlayerDocumentWithId, id));

    //TODO скорректировать с типом жеребьевки
    //TODO при жеребьевке лучше передавать не игроков а их статистику
    const games = makeRoundRobinDraw(id, playersStats as IPlayerStats[]);
    const savedGames = await createDocuments(getDBCollections().games, games) || [];
    const savedPlayersStats = await createDocuments(getDBCollections().playerStats, playersStats) || [];

    //TODO сохранить в турнир статистику игроков и сохранить каждому игроку
    //console.log(savedPlayersStats);

    tournamentForStart.isStarted = true;
    tournamentForStart.gamesIDs = savedGames.map(game => game?._id.toString());
    
    const updatedTournament = await updateDocument(getDBCollections().tournaments, id, tournamentForStart);

    response.json(updatedTournament);

    //let tournamentDocument: ITournamentDocumentWithId;
    //let playersDocuments: IPlayerDocumentWithId[];

    /* findDocumentById(getDBCollections().tournaments, id)
    ?.then(result  => {
        tournamentDocument = result as ITournamentDocumentWithId;
        
        if(tournamentDocument.players.length < 3) {
            response.status(400);
            throw new Error("Для старта турнира нужно как минимум 3 участника");
        }

        return Promise.all(tournamentDocument.players.map(playerId => {
            return findDocument(getDBCollections().players, {"_id": new ObjectId(playerId)});
        }));
    })
    .then(players => {
        playersDocuments = players as IPlayerDocumentWithId[];

        return Promise.all(players.map(player => {
            const playserStat = PlayerStat(player as IPlayerDocumentWithId, tournamentDocument);

            return createDocument(getDBCollections().playerStats, playserStat);
        }));
    })
    .then(() => {
        const games = makeRoundRobinDraw(playersDocuments as IPlayerDocumentWithId[]);
        return Promise.all(games.map(game => createDocument(getDBCollections().games, game)))
    })
    .then(gameDocuments => {
        if(tournamentDocument) {
            tournamentDocument.isStarted = true;
            tournamentDocument.games = gameDocuments.map(game => game?._id);
        }
        return updateDocument(getDBCollections().tournaments, id, tournamentDocument);
    })
    .then(result => response.json(result))
    .catch(error => next(error)); */
});
export const finishTournament = (request: Request, response: Response, next: NextFunction) => {
    response.json("Турнир завершился");
}


/*
    После старта турнира клиент получает обновленные данные турнира и список уже сформированных игр.
    На клиенте можно отобразить так: ФИО1 0:0 ФИО2.
    Добавить кнопку при нажатии на которую можно выбрать победителя или указать ничью
    После этих действий, данные отправляются на сервер для обновления данных game.
    Также нужно обновить данные игрока - очки, место, рейтинг Адамовича.
    Для этого нам нужен отдельный объект playerStats
*/