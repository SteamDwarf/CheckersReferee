import { CheckersColor } from "../common/enums";
import PlayerDocument from "../players/PlayerDocument.entity";
import { SportsCategoryStatus } from "../players/players.model";

class PlayerStatsPlain {
    public readonly playerID: string;
    public readonly tournamentID: string;
    public readonly playerName: string;
    public readonly birthday: string;
    public readonly age: number;
    public readonly region: string;
    public readonly sportsOrganization?: string;
    public readonly gorinRank: number;
    public readonly startAdamovichRank: number;
    public readonly lastAdamovichRank: number;
    public readonly startAdamovichTimeStamp: number;
    public readonly lastAdamovichTimeStamp: number;
    public readonly place: number;
    public readonly score: number;
    public readonly normScore: number;
    public readonly tournamentCoefficient: number;
    public readonly sportsCategoryID: string;
    public readonly sportsCategoryAbbr: string;
    public readonly newSportsCategoryID: string;
    public readonly newSportsCategoryAbbr: string;
    public readonly newSportsCategoryStatus: SportsCategoryStatus;
    public readonly newSportsCategoryTimestamp: string;
    public readonly requiredScore: number;
    public readonly colorUsed: number;
    public readonly lastColor: CheckersColor;
    public readonly competitorsID: (string | undefined)[];

    constructor(player: PlayerDocument, tournamentID: string) {
        this.playerID = player.id;
        this.tournamentID = tournamentID;
        this.playerName = player.fullName;
        this.birthday = player.birthday;
        this.age = player.age;
        this.region = player.region;
        this.sportsOrganization = player.sportsOrganization || '';
        this.gorinRank = 0;
        this.startAdamovichRank = player.currentAdamovichRank;
        this.lastAdamovichRank = player.currentAdamovichRank;
        this.startAdamovichTimeStamp = Date.now();
        this.lastAdamovichTimeStamp = Date.now();
        this.place = 0;
        this.score = 0;
        this.normScore = 0;
        this.tournamentCoefficient = 0;
        this.sportsCategoryID = player.sportsCategoryID;
        this.sportsCategoryAbbr = player.sportsCategoryAbbr;
        this.newSportsCategoryID = "";
        this.newSportsCategoryAbbr = "";
        this.newSportsCategoryStatus = player.newSportsCategoryStatus;
        this.newSportsCategoryTimestamp = player.newSportsCategoryTimestamp;
        this.requiredScore = 0;
        this.colorUsed = 0;
        this.lastColor = CheckersColor.black;
        this.competitorsID = [];
    }
}

export default PlayerStatsPlain;