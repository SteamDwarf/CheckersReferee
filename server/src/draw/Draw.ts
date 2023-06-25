import { ObjectId } from "mongodb";
import { CheckersColor } from "../common/enums";
import Utils from "../utils/Utils";
import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";
import GamePlain from "../games/GamePlain.entity";

class Draw {
    private readonly _fakePlayer: PlayerStatsDocument;
    private readonly _utils;

    constructor(utils: Utils) {
        this._utils = utils;
        this._fakePlayer = new PlayerStatsDocument({
            _id: new ObjectId("000000000000000000000000"),
            playerID: "0",
            playerName: "",
            colorUsed: 0,
            lastColor: CheckersColor.black,
            competitorsID: [""],
            score: 0,
            normScore: 0,
            tournamentCoefficient: 0,
            gorinRank: 0,
            birthday: "",
            age: 18,
            region: "",
            tournamentID: "",
            startAdamovichRank: 0,
            lastAdamovichRank: 0,
            startAdamovichTimeStamp: Date.now(),
            lastAdamovichTimeStamp: Date.now(),
            place: 0,
            requiredScore: 0,
            sportsCategoryID: "",
            sportsCategoryAbbr: ""
        });
    }

    get fakePlayer() {
        return this._fakePlayer.clone;
    }

    get utils() {
        return this._utils;
    }

    protected async makeGame(tournamentID: string, player1: PlayerStatsDocument, player2: PlayerStatsDocument) {
        const checkersColor = this.getCheckersColor(player1, player2);
        const game = new GamePlain(tournamentID, player1, player2, checkersColor);

        return game;
    }
    
    /**
     * @description Данная функция принимает данные игроков и возвращает цвет шашек для первого и второго игрока 
     * в зависимости от того каким цветом шашек и сколько раз он этим цветом играл играл
     * @param {typeof dummyStats} player1Checkers данные первого игрока
     * @param {typeof dummyStats} player2Checkers данные второго игрока
     * @returns {string[]} массив цветов шашек, для первого и второго игрока
     */
    protected getCheckersColor (player1: PlayerStatsDocument, player2: PlayerStatsDocument){
        if(!player1.playerName || !player2.playerName){
            return;
        }

        if(!player1.colorUsed && !player2.colorUsed) {
            return [CheckersColor.white, CheckersColor.black];
        }
    
        if(player1.lastColor !== player2.lastColor) {
            return [player2.lastColor, player1.lastColor];
        }
    
        if(player1.colorUsed > player2.colorUsed) {
            return [this.reverseCheckersColor(player1.lastColor), player2.lastColor];
        } else {
            return [player1.lastColor, this.reverseCheckersColor(player2.lastColor)];
        }
    }
    
    /**
     * @description Данная функция меняет цвет шашек на противоположный
     * @param {string} color - цвет шашек
     * @returns {string} противоположный цвет шашек
     */
    protected reverseCheckersColor(color: CheckersColor){
        return color === CheckersColor.white ? CheckersColor.black : CheckersColor.white;
    }

}

export default Draw;