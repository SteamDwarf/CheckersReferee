import TournamentDocument from "../tournaments/TournamentDocument.entity";
import RankListPlayer from "./RankListPlayer.entity";

class RankList {
    public readonly documentTitle: string;
    public readonly sportsDescipline: string;
    public readonly tournamentStartDate: string;
    public readonly players: RankListPlayer[];

    constructor(documentTitle: string, tournament: TournamentDocument, players: RankListPlayer[]) {
        this.documentTitle = documentTitle;
        this.sportsDescipline = tournament.sportsDescipline;
        this.tournamentStartDate = tournament.startDate || "";
        this.players = players;
    }
}

export default RankList;