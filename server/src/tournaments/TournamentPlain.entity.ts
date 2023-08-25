import TournamentCreateDTO from "./dtos/TournamentCreate.dto";
import { SportsDesciplines, TournamentSystems } from "./tournaments.model";

class TournamentPlain {
    public readonly cp: string;
    public readonly title: string;
    public readonly sportsDescipline: SportsDesciplines;
    public readonly groups: (string | undefined)[];
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
    public readonly coaches: (string | undefined)[];
    public readonly timeControl: string;
    public readonly toursCount: number;
    public readonly currentTour: number;
    public readonly tournamentSystem: TournamentSystems;
    public readonly playersIDs: (string | undefined)[];
    public readonly gamesIDs: (string | undefined)[][];
    public readonly playersStatsIDs: (string | undefined)[];
    public readonly sportsFacility?: string;


    constructor(tournamentData: TournamentCreateDTO) {
        this.cp = tournamentData.cp;
        this.title = tournamentData.title;
        this.sportsDescipline = tournamentData.sportsDescipline;
        this.groups = tournamentData.groups || [];
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
        this.coaches = tournamentData.coaches || [];
        this.timeControl = tournamentData.timeControl || "";
        this.toursCount = tournamentData.toursCount || 0;
        this.currentTour = 0;
        this.tournamentSystem = tournamentData.tournamentSystem;
        this.playersIDs = tournamentData.playersIDs || [];
        this.gamesIDs = [];
        this.playersStatsIDs = [];
        this.sportsFacility = tournamentData.sportsFacility || "";
    }
}

export default TournamentPlain;