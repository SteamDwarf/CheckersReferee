import SportsCategoryDocument from "../sportsCategory/SportsCategoryDocument.entity";
import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";
import TournamentDocument from "../tournaments/TournamentDocument.entity";

class PlayerSertificatePlain {
    public readonly cp: string;
    public readonly documentTitle: string;
    public readonly fullName: string;
    public readonly groups: (string | undefined)[];
    public readonly sportCategory: string;
    public readonly score: number;
    //TODO добавить в статистику игрока
    public readonly normScore: number;
    //TODO добавить в статистику игрока
    public readonly tournamentCoefficient: number;
    public readonly tournamentStartDate: string;
    public readonly tournamentEndDate: string;
    public readonly tournamentTitle: string;
    public readonly city: string;
    public readonly tournamentSystem: string;
    public readonly toursCount: number;
    public readonly playersCount: number;
    public readonly requiredTournamentCoefficient: number;
    public readonly mainReferee: string;
    public readonly mainSecretary: string;
    public readonly date: string;
    
    constructor(
        playerStats: PlayerStatsDocument, 
        tournament: TournamentDocument,
        sportsCategory: SportsCategoryDocument
    ) {
        this.cp = tournament.cp;
        this.documentTitle = `Справка_${playerStats.playerID}`;
        this.fullName = playerStats.playerName;
        this.groups = tournament.groups,
        this.sportCategory = sportsCategory.title;
        this.score = playerStats.score;
        //TODO рассчитывается и берется из статистики игрока
        this.normScore = playerStats.score;
        //TODO расчитывается и берется из статистики игрока
        this.tournamentCoefficient = 1.75;
        this.tournamentStartDate = tournament.startDate || "";
        this.tournamentEndDate = tournament.endDate || "";
        this.tournamentTitle = tournament.title;
        this.city = tournament.city;
        this.tournamentSystem = tournament.tournamentSystem;
        this.toursCount = tournament.toursCount || 0;
        this.playersCount = tournament.playersIDs.length;
        //TODO это необходимый турнирнырный коэффициент берется из спортивной категории
        this.requiredTournamentCoefficient = 2.0;
        this.mainReferee = tournament.mainReferee;
        this.mainSecretary = tournament.mainSecretary;
        this.date = `${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}`;
    }
}

export default PlayerSertificatePlain;