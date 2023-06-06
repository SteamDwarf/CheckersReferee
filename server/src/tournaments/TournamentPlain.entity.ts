import TournamentCreateDTO from "./dtos/TournamentCreate.dto";
import { TournamentSystems } from "./tournaments.model";

class TournamentPlain {
    public readonly title: string;
    public readonly startDate?: string;
    public readonly endDate?: string;
    public readonly country: string;
    public readonly city: string;
    public readonly region?: string;
    public readonly isStarted: boolean;
    public readonly isFinished: boolean;
    public readonly mainReferee: string;
    public readonly mainSecretary: string;
    public readonly referees: (string | undefined)[];
    public readonly timeControl?: string;
    public readonly toursCount?: number;
    public readonly tournamentSystem: TournamentSystems;
    public readonly playersIDs: (string | undefined)[];
    public readonly gamesIDs: (string | undefined)[][];
    public readonly playersStatsIDs: (string | undefined)[];

    constructor(tournamentData: TournamentCreateDTO) {
        this.title = tournamentData.title;
        this.startDate = tournamentData.startDate || "";
        this.endDate = tournamentData.endDate || "";
        this.country = tournamentData.country;
        this.city = tournamentData.city;
        this.region = tournamentData.region || "";
        this.isStarted = false;
        this.isFinished = false;
        this.mainReferee = tournamentData.mainReferee;
        this.mainSecretary = tournamentData.mainSecretary;
        this.referees = tournamentData.referees || [];
        this.timeControl = tournamentData.timeControl || "";
        this.tournamentSystem = tournamentData.tournamentSystem;
        this.playersIDs = tournamentData.playersIDs || [];
        this.gamesIDs = [];
        this.playersStatsIDs = [];
    }
}

export default TournamentPlain;