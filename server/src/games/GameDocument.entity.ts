import { CheckersColor } from "../common/enums";
import { IGameWithId } from "./games.model";

class GameDocument {
    private readonly _id: string;
    private readonly _tournamentID: string;
    private readonly _player1StatsID: string;
    private readonly _player2StatsID: string;
    private readonly _player1Name: string;
    private readonly _player2Name: string;
    private readonly _player1Score: number;
    private readonly _player2Score: number;
    private readonly _player1CheckersColor: CheckersColor;
    private readonly _player2CheckersColor: CheckersColor;
    

    constructor(gameData: IGameWithId) {
        this._id = gameData._id.toString();
        this._tournamentID = gameData.tournamentID;
        this._player1StatsID = gameData.player1StatsID;
        this._player2StatsID = gameData.player2StatsID;
        this._player1Name = gameData.player1Name;
        this._player2Name = gameData.player2Name;
        this._player1Score = gameData.player1Score;
        this._player2Score = gameData.player2Score;
        this._player1CheckersColor = gameData.player1CheckersColor;
        this._player2CheckersColor = gameData.player2CheckersColor;
    }

    public get id() {
        return this._id;
    }
    public get tournamentID() {
        return this._tournamentID;
    }

    public get player1StatsID(): string {
        return this._player1StatsID;
    }

    public get player2StatsID(): string {
        return this._player2StatsID;
    }
    
    public get player1Name(): string {
        return this._player1Name;
    }

    public get player2Name(): string {
        return this._player2Name;
    }

    public get player1Score(): number {
        return this._player1Score;
    }

    public get player2Score(): number {
        return this._player2Score;
    }

    public get player1CheckersColor(): CheckersColor {
        return this._player1CheckersColor;
    }

    public get player2CheckersColor(): CheckersColor {
        return this._player2CheckersColor;
    }

    public get data() {
        return {
            _id: this._id,
            tournamentID: this._tournamentID,
            player1StatsID: this._player1StatsID,
            player2StatsID: this._player2StatsID,
            player1Name: this._player1Name,
            player2Name: this._player2Name,
            player1Score: this._player1Score,
            player2Score: this._player2Score,
            player1CheckersColor: this._player1CheckersColor,
            player2CheckersColor: this._player2CheckersColor
        }
    }

}

export default GameDocument;