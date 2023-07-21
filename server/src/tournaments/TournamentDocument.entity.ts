import GameDocument from "../games/GameDocument.entity";
import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";
import { ITournamentWithId, SportsDesciplines, TournamentSystems } from "./tournaments.model";

class TournamentDocument {
    private readonly _id: string;
    private readonly _cp: string;
    private readonly _title: string;
    private readonly _sportsDescipline: SportsDesciplines;
    private readonly _groups: (string | undefined)[];
    private readonly _startDate?: string | undefined;
    private readonly _endDate?: string | undefined;
    private readonly _country: string;
    private readonly _city: string;
    private readonly _region?: string | undefined;
    private  _isStarted: boolean;
    private  _isFinished: boolean;
    private readonly _mainReferee: string;
    private readonly _mainSecretary: string;
    private readonly _referees: (string | undefined)[];
    private readonly _coaches: (string | undefined)[];
    private readonly _timeControl?: string | undefined;
    private  _toursCount?: number | undefined;
    private  _currentTour: number;
    private readonly _tournamentSystem: TournamentSystems;
    private readonly _playersIDs: (string | undefined)[];
    private  _gamesIDs: (string | undefined)[][];
    private  _playersStatsIDs: (string | undefined)[];
    private  _sportsFacility?: string


    constructor(tournament: ITournamentWithId) {
        this._id = tournament._id.toString();
        this._cp = tournament.cp;
        this._title = tournament.title;
        this._sportsDescipline = tournament.sportsDescipline;
        this._groups = tournament.groups;
        this._startDate = tournament.startDate;
        this._endDate = tournament.endDate;
        this._country = tournament.country;
        this._city = tournament.city;
        this._region = tournament.region;
        this._isStarted = tournament.isStarted;
        this._isFinished = tournament.isFinished;
        this._mainReferee = tournament.mainReferee;
        this._mainSecretary = tournament.mainSecretary;
        this._referees = tournament.referees;
        this._coaches = tournament.coaches;
        this._timeControl = tournament.timeControl;
        this._toursCount = tournament.toursCount;
        this._currentTour = tournament.currentTour;
        this._tournamentSystem = tournament.tournamentSystem;
        this._playersIDs = tournament.playersIDs;
        this._gamesIDs = tournament.gamesIDs;
        this._playersStatsIDs = tournament.playersStatsIDs;
        this._sportsFacility = tournament.sportsFacility;
    }

    public get id(): string {
        return this._id;
    }

    public get cp(): string {
        return this._cp;
    }

    public get title(): string {
        return this._title;
    }

    public get sportsDescipline(): string {
        return this._sportsDescipline;
    }

    public get groups(): (string | undefined)[] {
        return [...this._groups];
    }

    public get startDate(): string | undefined {
        return this._startDate;
    }

    public get endDate(): string | undefined {
        return this._endDate;
    }

    public get country(): string {
        return this._country;
    }

    public get city(): string {
        return this._city;
    }

    public get region(): string | undefined {
        return this._region;
    }

    public get isStarted(): boolean {
        return this._isStarted;
    }

    public get isFinished(): boolean {
        return this._isFinished;
    }

    public get mainReferee(): string {
        return this._mainReferee;
    }

    public get mainSecretary(): string {
        return this._mainSecretary;
    }

    public get referees(): (string | undefined)[] {
        return [...this._referees];
    }

    public get coaches(): (string | undefined)[] {
        return [...this._coaches];
    }

    public get timeControl(): string | undefined {
        return this._timeControl;
    }

    public get toursCount(): number | undefined {
        return this._toursCount;
    }

    public get currentTour(): number | undefined {
        return this._currentTour;
    }

    public get tournamentSystem(): TournamentSystems {
        return this._tournamentSystem;
    }

    public get playersIDs(): (string | undefined)[] {
        return [...this._playersIDs];
    }

    public get gamesIDs(): (string | undefined)[][] {
        return [...this._gamesIDs];
    }

    public get playersStatsIDs(): (string | undefined)[] {
        return [...this._playersStatsIDs];
    }

    public get sportsFacility(): string | undefined{
        return this._sportsFacility;
    }

    public get data() {
        return {
            _id: this._id,
            cp: this._cp,
            title: this._title,
            sportsDescipline: this._sportsDescipline,
            groups: this.groups,
            startDate: this._startDate,
            endDate: this._endDate,
            country: this._country,
            city: this._city,
            region: this._region,
            isStarted: this._isStarted,
            isFinished: this._isFinished,
            mainReferee: this._mainReferee,
            mainSecretary: this._mainSecretary,
            referees: this._referees,
            coaches: this._coaches,
            timeControl: this._timeControl,
            toursCount: this._toursCount,
            currentTour: this._currentTour,
            tournamentSystem: this._tournamentSystem,
            playersIDs: this._playersIDs,
            gamesIDs: this._gamesIDs,
            playersStatsIDs: this._playersStatsIDs,
            sportsFacility: this._sportsFacility
        }
    }

    public start(toursCount: number, playersStats: PlayerStatsDocument[], games: GameDocument[]) {
        this._isStarted = true;
        this._toursCount = toursCount;
        this._currentTour = 1;
        this._playersStatsIDs = playersStats.map(stat => stat.id);

        if(this._tournamentSystem === TournamentSystems.round) {
            const {toursGamesIDs} = this.splitGames(games, toursCount);
            this._gamesIDs = toursGamesIDs;
        } else if(this._tournamentSystem === TournamentSystems.swiss) {
            this._gamesIDs.push(games.map(game => game.id));
        }
    }

    public finish() {
        this._isFinished = true;
    }

    public addGamesIDs(gamesIDs: string[]) {
        this._gamesIDs.push(gamesIDs);
    }

    public nextTour() {
        this._currentTour += 1;
    }

    public restart() {
        this._currentTour = 1;
        this._isStarted = true;
        this._isFinished = false;
        this._gamesIDs = [];
        this._playersStatsIDs = [];
    }

    private splitGames(games: GameDocument[], toursCount: number) {
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
    }
}

export default TournamentDocument;