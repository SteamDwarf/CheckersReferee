import { Container, inject, injectable } from "inversify";
import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import RoundRobinDraw from "../draw/RoundRobinDraw";
import SwissDraw from "../draw/SwissDraw";
import { InputError } from "../errors/Input.error";
import { NotFoundError } from "../errors/NotFound.error";
import GameService from "../games/Games.service";
import { ITournament, ITournamentWithId, TournamentSystems } from "./tournaments.model";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import PlayersService from "../players/Players.service";
import { MAIN, REPOSITORIES, SERVICES } from "../common/injectables.types";
import Utils from "../utils/Utils";
import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";
import TournamentCreateDTO from "./dtos/TournamentCreate.dto";
import TournamentPlain from "./TournamentPlain.entity";
import TournamentRepository from "./Tournament.repository";
import TournamentDocument from "./TournamentDocument.entity";
import TournamentUpdateDTO from "./dtos/TournamentUpdate.dto";
import GameDocument from "../games/GameDocument.entity";

@injectable()
class TournamentService extends BaseService {
    private _roundRobinDraw: RoundRobinDraw;
    private  _swissDraw: SwissDraw;
    private _playersService: PlayersService;
    private _gamesService: GameService;

    constructor(
        @inject(MAIN.Database) db: DataBase, 
        @inject(SERVICES.PlayerStats) private readonly _playerStatsService: PlayerStatsService,
        @inject(MAIN.Utils) private readonly _utils: Utils,
        @inject(REPOSITORIES.Tournament) private readonly _tournamentRepository: TournamentRepository
    ) {
        super(db);
    }

    
    public lazyInject(container: Container) {

        this._playersService = container.get<PlayersService>(SERVICES.Player);
        this._gamesService = container.get<GameService>(SERVICES.Game);

        this._roundRobinDraw = new RoundRobinDraw(this._gamesService, this._playerStatsService, this._utils);
        this._swissDraw = new SwissDraw(this._gamesService, this._playerStatsService, this._utils);
    }

    public async getTournaments (){
        const tournamentsPlainDocuments = await this._tournamentRepository.getAllTournaments();
        return tournamentsPlainDocuments.map(tournament =>  new TournamentDocument(tournament));
        /* const tournaments = await this.db.findDocuments(this.db.collections.tournaments) as ITournamentWithId[];
        
        return tournaments; */
    }

    public async getTournamentByID(id:  string) {
        const tournamentPlainDocument = await this._tournamentRepository.getTournamentByID(id);

        if(tournamentPlainDocument) {
            return new TournamentDocument(tournamentPlainDocument);
        }

        return null;
        //return await this.db.findDocumentById(this.db.collections.tournaments, id) as ITournamentWithId;
    }

    //TODO разобраться с tournamentData
    
    public async createTournament(tournamentData: TournamentCreateDTO){
        const tournamentPlain = new TournamentPlain(tournamentData);
        const tournamentPlainDocument = await this._tournamentRepository.createTournament(tournamentPlain);
        return new TournamentDocument(tournamentPlainDocument);
        //return await this.db.createDocument(this.db.collections.tournaments, tournamentData) as ITournamentWithId;
    }

    public async deleteTournament (id: string){
        const tournamentForDeleting = await this._tournamentRepository.getTournamentByID(id);
    
        if(!tournamentForDeleting) throw new NotFoundError("По указанному id турнир не найден");
    
        return await this._tournamentRepository.deleteTournament(id);
    }

    public async updateTournament (id: string, newData: TournamentUpdateDTO) {
        const documentForUpdate = await this._tournamentRepository.getTournamentByID(id);
    
        if(!documentForUpdate) throw new NotFoundError("По указанному id турнир не найден");

        const tournamentPlainDocument = await this._tournamentRepository.updateTournament(id, newData);
        return new TournamentDocument(tournamentPlainDocument);
    }

    public async updateTournamentDocument(id: string, tournament: TournamentDocument) {
        const {_id: _, ...tournamentData} = tournament.data;
        const tournamentPlainDocument = await this._tournamentRepository.updateTournament(id, tournamentData);
        
        return new TournamentDocument(tournamentPlainDocument);
    }

    public async startTournament(id: string){
        const tournamentDocument = await this.getTournamentByID(id)

        if(!tournamentDocument) throw new NotFoundError("По указанному id турнир не найден")

        const players = await this.findPlayers(tournamentDocument.playersIDs as string[]);
        const playersStats  = await this._playerStatsService.createPlayersStats(players, id);

        const {games, toursCount} = await this.makeStartDraw(tournamentDocument, playersStats);
        const gamesDocuments = await this._gamesService.createGames(games);

        //await this._playerStatsService.updateAfterDraw(playersStats, )
        await this._playerStatsService.updatePlayersStats(playersStats);
        await this._playersService.saveStatsToPlayers(players, playersStats);
    
        tournamentDocument.start(toursCount, playersStats, gamesDocuments);

        return await this.updateTournamentDocument(id, tournamentDocument);
        /* tournamentDocument.toursCount = toursCount;
        tournamentForStart.isStarted = true;
        tournamentForStart.playersStatsIDs = playersStats.map(stat => stat.id); */
        
        /* if(tournamentForStart.tournamentSystem === TournamentSystems.round) {
            const {toursGamesIDs} = this.splitGames(games, toursCount);
            tournamentDocument.addGamesIDs([...toursGamesIDs]);
            //tournamentForStart.gamesIDs = toursGamesIDs;
        } else if(tournamentForStart.tournamentSystem === TournamentSystems.swiss) {
            tournamentForStart.gamesIDs.push(games.map(game => game.id.toString()));
        } */
        
        //return await this.updateTournament(id, tournamentForStart);
    }

    public async finishTour(id: string) {
        const playersStats = await this._playerStatsService.getPlayersStatsFromTournament(id);
        let tournamentDocument = await this.getTournamentByID(id);

        if(!tournamentDocument) throw new NotFoundError("По указанному id турнир не найден")

        if(tournamentDocument.tournamentSystem === TournamentSystems.swiss) {
            const games = await this._swissDraw.makeDrawAfterTour(id, playersStats);
            const gamesDocuments = await this._gamesService.createGames(games);
            const gamesIDs = gamesDocuments.map(game => game.id.toString());

            //TODO сохранить playerStats
            //TODO создать поле в tournament указывающий номер текущего тура
            
            await this._playerStatsService.updatePlayersStats(playersStats);
            tournamentDocument.addGamesIDs(gamesIDs);

            tournamentDocument = await this.updateTournamentDocument(id, tournamentDocument);
        } 

        return tournamentDocument;
    }

    public async finishTournament (id: string){
        const tournamentDocument = await this.getTournamentByID(id);
    
        if(!tournamentDocument) throw new NotFoundError("По указанному id турнир не найден")

        const playersStats = await this._playerStatsService.getPlayersStatsFromTournament(id);
        const games = await this._gamesService.getGamesFromTournament(id);
    
        await this._playerStatsService.updateAfterTournament(playersStats, games);
        await this._playersService.updatePlayersAfterTournament(playersStats);
    
        tournamentDocument.finish();
    
        return await this.updateTournamentDocument(id, tournamentDocument);
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

    private async makeStartDraw(tournament: TournamentDocument, playersStats: PlayerStatsDocument[]) {
        if(tournament.tournamentSystem === TournamentSystems.swiss) {
            return this._swissDraw.makeStartDraw(tournament.id.toString(), playersStats);
        } else  {
            return this._roundRobinDraw.makeStartDraw(tournament.id.toString(), playersStats);
        } 
    }

    
    /* private splitGames(games: GameDocument[], toursCount: number) {
        const gamesInTour = games.length / toursCount;
        const tours: GameDocument[][] = [];
        const toursGamesIDs: string[][] = [];
    
        for(let i = 0; i < toursCount; i++) {
            const tour: GameDocument[] = [];
            const gamesIDs: string[] = [];
    
            for(let j = 0; j < gamesInTour; j++) {
                tour.push(games[j + i * gamesInTour]);
                gamesIDs.push(games[j + i * gamesInTour].id.toString());
            }
    
            tours.push(tour);
            toursGamesIDs.push(gamesIDs);
        }
    
        return {tours, toursGamesIDs}
    } */
}

export default TournamentService;



