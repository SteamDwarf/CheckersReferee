
import { CheckersColor } from "../common/enums";
import { IPlayerWithId } from "../players/players.model";

class PlayerStats {
    private readonly _playerID;
    private readonly _playerName;
    private readonly _birthday;
    private readonly _tournamentID;
    private readonly _gorinRank;
    private readonly _startAdamovichRank;
    private readonly _lastAdamovichRank;
    private readonly _startAdamovichTimeStamp;
    private readonly _lastAdamovichTimeStamp;
    private readonly _place;
    private readonly _score;
    private readonly _requiredScore;
    private readonly _colorUsed;
    private readonly _lastColor;
    private readonly _sportsCategoryID;
    private readonly _competitorsID: string[];
    
    constructor(player: IPlayerWithId, playerName: string, tournamentID: string) {
        this._playerID = player._id.toString();
        this._playerName = playerName;
        this._birthday = player.birthday;
        this._tournamentID = tournamentID;
        this._gorinRank = 0;
        this._startAdamovichRank = player.currentAdamovichRank;
        this._lastAdamovichRank = player.currentAdamovichRank;
        this._startAdamovichTimeStamp = Date.now();
        this._lastAdamovichTimeStamp = Date.now();
        this._place = 0;
        this._score = 0;
        this._requiredScore = 0;
        this._colorUsed = 0;
        this._lastColor = CheckersColor.black;
        this._sportsCategoryID = player.sportsCategoryID;
        this._competitorsID = []
    }

    /* public compareByScore(player1: PlayerStats, player2: PlayerStats){
        if(player1.score > player2.score) return -1;
        if(player1.score < player2.score) return 1;
        return compareByGorinRank(player1, player2);
    }
    
    public compareByGorinRank(player1: IPlayerStats, player2: IPlayerStats){
        if(player1.gorinRank > player2.gorinRank) return -1;
        if(player1.gorinRank < player2.gorinRank) return 1;
        return compareByAdamovichRank(player1, player2);
    }
    
    public compareByAdamovichRank(player1: IPlayerStats, player2: IPlayerStats){
        if(player1.lastAdamovichRank > player2.lastAdamovichRank) return -1;
        if(player1.lastAdamovichRank < player2.lastAdamovichRank) return 1;
        return compareByBirthday(player1, player2);
    }
    
    public compareByBirthday(player1: IPlayerStats, player2: IPlayerStats){
        if(new Date(player1.birthday) > new Date(player2.birthday)) return -1;
        if(new Date(player1.birthday) < new Date(player2.birthday)) return 1;
        return compareByPlayerName(player1, player2);
    }
    
    public compareByPlayerName(player1: IPlayerStats, player2: IPlayerStats){
        if(player1.playerName > player2.playerName) return 1;
        if(player1.playerName < player2.playerName) return -1;
        return 0;
    } */
}