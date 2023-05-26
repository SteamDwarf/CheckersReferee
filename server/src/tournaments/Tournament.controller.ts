import { Request, Response } from "express";
import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import TournamentService from "./Tournament.service";
import TournamentMiddleware from "./Tournament.middleware";
import { ITournament } from "../models/tournaments.model";

class TournamentController extends BaseController {
    private readonly _tournamentMidleware;
    private readonly _tournamentService;

    constructor(tournamentMiddleware: TournamentMiddleware, tournamenService: TournamentService) {
        super();

        this._tournamentMidleware = tournamentMiddleware;
        this._tournamentService = tournamenService;
        this.initRoutes([
            new ControllerRoute('/','get', [], this.asyncHandler(this.get)),
            new ControllerRoute('/','post', 
                [ this._tournamentMidleware.validateTournamentSystem], 
                this.asyncHandler(this.create)
            ),
            new ControllerRoute('/:id','get', [], this.asyncHandler(this.getByID)),
            new ControllerRoute('/:id','put', [], this.asyncHandler(this.update)),
            new ControllerRoute('/:id','delete', [], this.asyncHandler(this.delete)),
            new ControllerRoute('/start/:id','put', 
                [this.asyncHandler(this._tournamentMidleware.checkTournamentforStart)], 
                this.asyncHandler(this.start)
            ),
            new ControllerRoute('/finish/:id','put', 
                [this.asyncHandler(this._tournamentMidleware.checkTournamentForFinish)], 
                this.asyncHandler(this.finishTournament)
            ),
            new ControllerRoute('/finish-tour/:id','put', [], this.asyncHandler(this.finishTour))
        ]);
    }

    private async get(request: Request, response: Response) {
        console.log("work");
        const page = request.query.page || "1";
        const limit = request.query.limit || "10";
        const tournaments = await this._tournamentService.getTournaments(+page, +limit);

        response.json(tournaments);
    }
    private async getByID(request: Request, response: Response) {
        console.log("work");

        const {id} = request.params;
        const tournament = await this._tournamentService.getTournamentByID(id);
    
        response.json(tournament);
    }
    private async create(request: Request, response: Response) {
        console.log("work");

        const createdTournament = await this._tournamentService.postTournament(request.body);
    
        response.json(createdTournament);
    }
    private async update(request: Request, response: Response) {
        console.log("work");

        const {id} = request.params;
        const tournamentData: ITournament = request.body;
        const updatedTournament = await this._tournamentService.updateTournament(id, tournamentData);

        response.json(updatedTournament);
    }
    private async delete(request: Request, response: Response) {
        console.log("work");

        const {id} = request.params;
        const deleteResult = await this._tournamentService.deleteTournament(id);

        response.json(deleteResult);
    }
    private async start(request: Request, response: Response) {
        const {id} = request.params;
        const startedTournament = await this._tournamentService.startTournament(id);

        response.json(startedTournament);
    }
    private async finishTournament(request: Request, response: Response) {
        const {id} = request.params;
        const updatedTournament = await this._tournamentService.finishTournament(id);

        response.json(updatedTournament);
    }
    private async finishTour(request: Request, response: Response) {
        return;
    }
}

export default TournamentController;



/* export const finishTournament = expressAsyncHandler(async(request: Request, response: Response) => {
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

export const finishTour = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const playersStats = await findDocumentsWithFilter(getDBCollections().playerStats, {
        tournamentID: id
    }) as IPlayerStatsWithID[];
    let tournament = await findDocumentById(getDBCollections().tournaments, id) as ITournamentWithId;

    if(!tournament) throw new NotFoundError("По указанному id турнир не найден");
    if(!tournament.isStarted) throw new NotFoundError("Данный турнир еще не стартовал");
    if(tournament.isFinished) throw new NotFoundError("Данный турнир уже завершился");

    if(tournament.tournamentSystem === TournamentSystems.swiss) {
        const games = makeSwissDrawAfterTour(tournament._id.toString(), playersStats);
        const savedGames = await createDocuments(getDBCollections().games, games) as IGameWithId[];
        const savedGamesIDs = savedGames.map(game => game._id.toString());

        //TODO сохранить playerStats
        //TODO создать поле в tournament указывающий номер текущего тура
        await updateDocuments(getDBCollections().playerStats, playersStats);
        tournament.gamesIDs.push(savedGamesIDs);

        tournament = await updateDocument(getDBCollections().tournaments, tournament._id.toString(), tournament) as ITournamentWithId;
    } 

    response.json(tournament);
});

const makeDraw = (tournament: ITournamentWithId, playerStats: IPlayerStatsWithID[]) => {
    if(tournament.tournamentSystem === TournamentSystems.swiss) {
        return makeFirstSwissDraw(tournament._id.toString(), playerStats);
    } else  {
        return makeRoundRobinDraw(tournament._id.toString(), playerStats);
    } 
    
}

const findPlayers = async(playersIDs: string[]) => {
    const players = await findDocumentsById(getDBCollections().players, playersIDs) || [];

    if(players.length < playersIDs.length) {
        const notFoundedPlayers = playersIDs.filter(id => {
            const playerData = players.find(player => player._id.toString() === id);

            return !playerData;
        });

        throw new NotFoundError(`В базе данных не было найдено ${playersIDs.length - players.length} игрока`, {notFoundedPlayers})
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
 */
