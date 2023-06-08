import TournamentDocument from "../tournaments/TournamentDocument.entity";
import RankListPlayer from "./RankListPlayer.entity";

class RankList {
    public readonly documentTitle: string;
    public readonly sportsDescipline: string;
    public readonly tournamentStartDate: string;
    public readonly players: RankListPlayer[];

    constructor(tournament: TournamentDocument, players: RankListPlayer[]) {
        this.documentTitle = `Рейтинг-лист_${tournament.id}`;
        //TODO добавить поле в турнир
        this.sportsDescipline = "руские шашки";
        this.tournamentStartDate = tournament.startDate || "";
        this.players = players;
    }
}

export default RankList;