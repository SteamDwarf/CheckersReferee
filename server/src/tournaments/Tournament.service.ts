import { Container, inject, injectable } from "inversify";
import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import RoundRobinDraw from "../draw/RoundRobinDraw";
import SwissDraw from "../draw/SwissDraw";
import { InputError } from "../errors/Input.error";
import { NotFoundError } from "../errors/NotFound.error";
import GameService from "../games/Games.service";
import { ITournament, ITournamentWithId, TournamentSystems } from "../models/tournaments.model";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import PlayersService from "../players/Players.service";
import { MAIN, SERVICES } from "../common/injectables.types";
import Utils from "../utils/Utils";
import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";

@injectable()
class TournamentService extends BaseService {
    private _roundRobinDraw: RoundRobinDraw;
    private  _swissDraw: SwissDraw;
    private _playersService: PlayersService;
    private _gamesService: GameService;

    constructor(
        @inject(MAIN.Database) db: DataBase, 
        //@inject(SERVICES.Player) private readonly _playerService: PlayerService, 
        @inject(SERVICES.PlayerStats) private readonly _playerStatsService: PlayerStatsService,
        //@inject(SERVICES.Game) private readonly _gameService: GameService,
        @inject(MAIN.Utils) private readonly _utils: Utils
    ) {
        super(db);

        //this._roundRobinDraw = new RoundRobinDraw(this._gameService, this._playerStatsService, _utils);
        //this._swissDraw = new SwissDraw(this._gameService, this._playerStatsService, _utils);
    }

    
    public lazyInject(container: Container) {
        this._playersService = container.get<PlayersService>(SERVICES.Player);
        this._gamesService = container.get<GameService>(SERVICES.Game);

        this._roundRobinDraw = new RoundRobinDraw(this._gamesService, this._playerStatsService, this._utils);
        this._swissDraw = new SwissDraw(this._gamesService, this._playerStatsService, this._utils);
    }

    public async getTournaments (){
        const tournaments = await this.db.findDocuments(this.db.collections.tournaments) as ITournamentWithId[];
        
        return tournaments;
        //return this.paginateData(tournaments || [], limit, page);
    }

    public async getTournamentByID(id:  string) {
        return await this.db.findDocumentById(this.db.collections.tournaments, id) as ITournamentWithId;
    }

    //TODO разобраться с tournamentData
    
    public async postTournament(mainData: any){
        const tournamentData: ITournament = {
            ...mainData,
            isStarted: false,
            isFinished: false,
            referees: [],
            playersIDs: mainData.playersIDs || [],
            gamesIDs: mainData.gamesIDs || [],
            playersStatsIDs: []
        };
    
        return await this.db.createDocument(this.db.collections.tournaments, tournamentData) as ITournamentWithId;
    }

    public async deleteTournament (id: string){
        const tournamentForDeleting = await this.db.findDocumentById(this.db.collections.tournaments, id) as ITournamentWithId;
    
        if(!tournamentForDeleting) throw new NotFoundError("По указанному id турнир не найден");
    
        return await this.db.deleteDocument(this.db.collections.tournaments, id);
    }

    public async updateTournament (id: string, newData: ITournament) {
        const documentForUpdate = await this.db.findDocumentById(this.db.collections.tournaments, id) as ITournamentWithId;
    
        if(!documentForUpdate) throw new NotFoundError("По указанному id турнир не найден");
    
        return await this.db.updateDocument(this.db.collections.tournaments, id, newData) as ITournamentWithId;
    }

    public async startTournament(id: string){
        const tournamentForStart = await this.db.findDocumentById(this.db.collections.tournaments, id) as ITournamentWithId;
        const players = await this.findPlayers(tournamentForStart.playersIDs as string[]);
        const playersStats  = await this._playerStatsService.createPlayersStats(players, id);

        const {games, toursCount} = await this.makeStartDraw(tournamentForStart, playersStats);
        console.log("maked games");
        await this._playersService.saveStatsToPlayers(players, playersStats);
        console.log("saved to playerStats");
    
        tournamentForStart.toursCount = toursCount;
        tournamentForStart.isStarted = true;
        tournamentForStart.playersStatsIDs = playersStats.map(stat => stat.id);
        
        if(tournamentForStart.tournamentSystem === TournamentSystems.round) {
            const {toursGamesIDs} = this._gamesService.splitGames(games, toursCount);
            tournamentForStart.gamesIDs = toursGamesIDs;
        } else if(tournamentForStart.tournamentSystem === TournamentSystems.swiss) {
            tournamentForStart.gamesIDs.push(games.map(game => game.id.toString()));
        }
        
        return await this.updateTournament(id, tournamentForStart);
    }

    public async finishTour(id: string) {
        const playersStats = await this._playerStatsService.getPlayersStatsOfTournament(id);
        let tournament = await this.getTournamentByID(id);

        if(tournament.tournamentSystem === TournamentSystems.swiss) {
            const games = await this._swissDraw.makeDrawAfterTour(id, playersStats);
            const savedGamesIDs = games.map(game => game.id.toString());

            //TODO сохранить playerStats
            //TODO создать поле в tournament указывающий номер текущего тура
            tournament.gamesIDs.push(savedGamesIDs);

            tournament = await this.updateTournament(id, tournament);
        } 

        return tournament;
    }

    public async finishTournament (id: string){
        const tournamentForFinish = await this.getTournamentByID(id);
    
        const playersStats = await this._playerStatsService.getPlayersStatsOfTournament(id);
        const games = await this._gamesService.getGamesFromTournament(id);
    
        await this._playerStatsService.updateAfterTournament(playersStats, games);
        await this._playersService.updatePlayersAfterTournament(playersStats);
    
        tournamentForFinish.isFinished = true;
    
        return await this.updateTournament(id, tournamentForFinish);
    }

    private async findPlayers(playersIDs: string[]) {
        const players = await this._playersService.getPlayersByID(playersIDs);
    
        if(players.length < playersIDs.length) {
            const notFoundedPlayers = playersIDs.filter(id => {
                const playerData = players.find(player => player.id.toString() === id);
    
                return !playerData;
            });
    
            throw new NotFoundError(`В базе данных не было найдено ${playersIDs.length - players.length} игрока`, {notFoundedPlayers})
        }
    
        return players;
    }

    private async makeStartDraw(tournament: ITournamentWithId, playersStats: PlayerStatsDocument[]) {
        if(tournament.tournamentSystem === TournamentSystems.swiss) {
            return this._swissDraw.makeStartDraw(tournament._id.toString(), playersStats);
        } else  {
            return this._roundRobinDraw.makeStartDraw(tournament._id.toString(), playersStats);
        } 
    }
}

export default TournamentService;



