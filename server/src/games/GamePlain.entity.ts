import { CheckersColor } from "../common/enums";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import { Game, IGame } from "./games.model";

class GamePlain implements IGame {
    public readonly tournamentID: string;
    public readonly player1StatsID: string;
    public readonly player2StatsID: string;
    public readonly player1Name: string;
    public readonly player2Name: string;
    public readonly player1Score: number;
    public readonly player2Score: number;
    public readonly player1CheckersColor: CheckersColor;
    public readonly player2CheckersColor: CheckersColor;

    constructor(
        tournamentID: string, 
        player1Stats: IPlayerStatsWithID,
        player2Stats: IPlayerStatsWithID,
        checkersColors: CheckersColor[]
    ) {
        this.tournamentID = tournamentID;
        this.player1StatsID = player1Stats._id.toString();
        this.player2StatsID = player2Stats._id.toString();
        this.player1Name = player1Stats.playerName;
        this.player2Name = player2Stats.playerName;
        this.player1Score = 0;
        this.player2Score = 0;
        this.player1CheckersColor = checkersColors[0] || CheckersColor.black;
        this.player2CheckersColor = checkersColors[1] || CheckersColor.black;
    }
}

export default GamePlain;