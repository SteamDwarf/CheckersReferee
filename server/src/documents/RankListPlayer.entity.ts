import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";
import PlayerDocument from "../players/PlayerDocument.entity";

class RankListPlayer {
    public readonly index: number;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly region: string;
    public readonly birthYear: number;
    public readonly sportsCategoryAbbr: string;
    public readonly currentAdamovichRank: string;

    constructor(index: number, player: PlayerStatsDocument) {
        const playerNames = player.playerName.split(" ");

        this.index = index;
        this.lastName = playerNames[0];
        this.firstName = playerNames[1];
        this.region = player.region;
        this.birthYear = new Date(player.birthday).getFullYear();
        this.sportsCategoryAbbr = player.sportsCategoryAbbr;
        this.currentAdamovichRank = player.lastAdamovichRank.toFixed(2);
    }
}

export default RankListPlayer;