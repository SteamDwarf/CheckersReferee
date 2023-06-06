import { ISportsCategoryWithID } from "../sportsCategory/sportsCategory.model";
import { ITournamentWithId } from "../tournaments/tournaments.model";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import PlayerDocument from "../players/PlayerDocument.entity";
import SportsCategoryDocument from "../sportsCategory/SportsCategoryDocument.entity";
import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";
import TournamentDocument from "../tournaments/TournamentDocument.entity";

class PlayerSertificatePlain {
    public readonly documentTitle: string;
    public readonly fullName: string;
    //TODO добавить
    public readonly groups: string[];
    public readonly sportCategory: string;
    public readonly score: number;
    //TODO добавить
    public readonly normScore: number;
    //TODO добавить
    public readonly playerCoefficient: number;
    public readonly tournamentStartDate: string;
    public readonly tournamentEndDate: string;
    public readonly tournamentTitle: string;
    public readonly tournamentRegion: string;
    public readonly tournamentSystem: string;
    public readonly toursCount: number;
    public readonly playersCount: number;
    //TODO добавить
    public readonly tournamentCoefficient: number;
    public readonly mainReferee: string;
    public readonly mainSecretary: string;
    public readonly date: string;
    
    constructor(
        playerStats: PlayerStatsDocument, 
        tournament: TournamentDocument,
        sportsCategory: SportsCategoryDocument
    ) {
        this.documentTitle = `Справка_${playerStats.playerID}`;
        this.fullName = playerStats.playerName;
        this.groups = ["юноши и девушки до 17 лет", "юноши и девушки до 14 лет"],
        this.sportCategory = sportsCategory.title;
        this.score = playerStats.score;
        this.normScore = playerStats.score;
        this.playerCoefficient = 1.75;
        this.tournamentStartDate = tournament.startDate || "";
        this.tournamentEndDate = tournament.endDate || "";
        this.tournamentTitle = tournament.title;
        //TODO заменить на city
        this.tournamentRegion = tournament.city;
        this.tournamentSystem = tournament.tournamentSystem;
        this.toursCount = tournament.toursCount || 0;
        this.playersCount = tournament.playersIDs.length;
        this.tournamentCoefficient = 2.0;
        this.mainReferee = tournament.mainReferee;
        this.mainSecretary = tournament.mainSecretary;
        this.date = `${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}`;
    }
}

export default PlayerSertificatePlain;