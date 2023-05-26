import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import RoundRobinDraw from "../draw/RoundRobinDraw";
import { NotFoundError } from "../errors/NotFound.error";
import GameService from "../games/Game.service";
import { ITournament, ITournamentWithId, TournamentSystems } from "../models/tournaments.model";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import PlayerService from "../players/Player.service";

class TournamentService extends BaseService {
    private readonly _playerService;
    private readonly _playerStatsService;
    private readonly _gameService;
    private readonly _roundRobinDraw;

    constructor(
        db: DataBase, 
        playerService: PlayerService, 
        playerStatsService: PlayerStatsService,
        gameService: GameService,
    ) {
        super(db);

        this._playerService = playerService;
        this._playerStatsService = playerStatsService;
        this._gameService = gameService;
        this._roundRobinDraw = new RoundRobinDraw(this._gameService, this._playerStatsService);
    }

    public async getTournaments (page: number, limit: number){
        const tournaments = await this.db.findDocuments(this.db.collections.tournaments) as ITournamentWithId[];
    
        return this.paginateData(tournaments || [], limit, page);
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
    
        await this._playerService.saveStatsToPlayers(players, playersStats);
    
        tournamentForStart.toursCount = toursCount;
        tournamentForStart.isStarted = true;
        tournamentForStart.playersStatsIDs = playersStats.map(stat => stat._id.toString());
        
        if(tournamentForStart.tournamentSystem === TournamentSystems.round) {
            const {toursGamesIDs} = this._gameService.splitGames(games, toursCount);
            tournamentForStart.gamesIDs = toursGamesIDs;
        } else if(tournamentForStart.tournamentSystem === TournamentSystems.swiss) {
            tournamentForStart.gamesIDs.push(games.map(game => game._id.toString()));
        }
        
        return await this.updateTournament(id, tournamentForStart);
    }

    private async findPlayers(playersIDs: string[]) {
        const players = await this._playerService.getPlayersByID(playersIDs);
    
        if(players.length < playersIDs.length) {
            const notFoundedPlayers = playersIDs.filter(id => {
                const playerData = players.find(player => player._id.toString() === id);
    
                return !playerData;
            });
    
            throw new NotFoundError(`В базе данных не было найдено ${playersIDs.length - players.length} игрока`, {notFoundedPlayers})
        }
    
        return players;
    }

    private async makeStartDraw(tournament: ITournamentWithId, playersStats: IPlayerStatsWithID[]) {
        /* if(tournament.tournamentSystem === TournamentSystems.swiss) {
            return makeFirstSwissDraw(tournament._id.toString(), playerStats);
        } else  { */
            return this._roundRobinDraw.makeStartDraw(tournament._id.toString(), playersStats);
        /* } */ 
    }
}

export default TournamentService;



