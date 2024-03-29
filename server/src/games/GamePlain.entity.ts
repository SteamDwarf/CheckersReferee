import { CheckersColor } from "../common/enums";
import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";
import {IGame } from "./games.model";

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
        player1Stats: PlayerStatsDocument,
        player2Stats: PlayerStatsDocument,
        checkersColors?: CheckersColor[]
    ) {
        this.tournamentID = tournamentID;
        this.player1StatsID = player1Stats.id;
        this.player2StatsID = player2Stats.id;
        this.player1Name = player1Stats.playerName;
        this.player2Name = player2Stats.playerName;
        this.player1Score = 0;
        this.player2Score = 0;
        this.player1CheckersColor = checkersColors ? checkersColors[0] : CheckersColor.black;
        this.player2CheckersColor = checkersColors ? checkersColors[1] : CheckersColor.black;
    }
}

export default GamePlain;