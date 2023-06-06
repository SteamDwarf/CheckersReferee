import { CheckersColor } from "../common/enums";
import PlayerDocument from "../players/PlayerDocument.entity";

class PlayerStatsPlain {
    public readonly playerID: string;
    public readonly tournamentID: string;
    public readonly playerName: string;
    public readonly birthday: string;
    public readonly gorinRank: number;
    public readonly startAdamovichRank: number;
    public readonly lastAdamovichRank: number;
    public readonly startAdamovichTimeStamp: number;
    public readonly lastAdamovichTimeStamp: number;
    public readonly place: number;
    public readonly score: number;
    public readonly sportsCategoryID: string;
    public readonly requiredScore: number;
    public readonly colorUsed: number;
    public readonly lastColor: CheckersColor;
    public readonly competitorsID: (string | undefined)[];

    constructor(player: PlayerDocument, tournamentID: string) {
        this.playerID = player.id;
        this.tournamentID = tournamentID;
        this.playerName = player.fullName;
        this.birthday = player.birthday;
        this.gorinRank = 0;
        this.startAdamovichRank = player.currentAdamovichRank;
        this.lastAdamovichRank = player.currentAdamovichRank;
        this.startAdamovichTimeStamp = Date.now();
        this.lastAdamovichTimeStamp = Date.now();
        this.place = 0;
        this.score = 0;
        this.sportsCategoryID = player.sportsCategoryID;
        this.requiredScore = 0;
        this.colorUsed = 0;
        this.lastColor = CheckersColor.black;
        this.competitorsID = [];
    }
}

export default PlayerStatsPlain;