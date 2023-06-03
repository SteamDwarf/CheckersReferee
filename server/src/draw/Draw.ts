import { ObjectId } from "mongodb";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import GameService from "../games/Games.service";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import { CheckersColor } from "../common/enums";
import Utils from "../utils/Utils";

class Draw {
    private readonly _fakePlayer: IPlayerStatsWithID;
    private readonly _gameService;
    private readonly _playerStatsService;
    private readonly _utils;

    constructor(gameService: GameService, playerStatsService: PlayerStatsService, utils: Utils) {
        this._gameService = gameService;
        this._playerStatsService = playerStatsService;
        this._utils = utils;
        this._fakePlayer = {
            _id: new ObjectId("000000000000000000000000"),
            playerID: "0",
            playerName: "",
            colorUsed: 0,
            lastColor: CheckersColor.black,
            competitorsID: [""],
            score: 0,
            gorinRank: 0,
            birthday: "",
            tournamentID: "",
            startAdamovichRank: 0,
            lastAdamovichRank: 0,
            startAdamovichTimeStamp: Date.now(),
            lastAdamovichTimeStamp: Date.now(),
            place: 0,
            requiredScore: 0,
            sportsCategoryID: "",
        }
    }

    get fakePlayer() {
        return {...this._fakePlayer}
    }

    get gameService() {
        return this._gameService;
    }

    get playerStatsService() {
        return this._playerStatsService;
    }

    get utils() {
        return this._utils;
    }

    protected async makeGame(tournamentID: string, player1: IPlayerStatsWithID, player2: IPlayerStatsWithID) {
        const checkersColor = this.getCheckersColor(player1, player2);
        const game = await this.gameService.createGame(
            tournamentID,
            player1,
            player2,
            checkersColor
        );

        return game;
    }
    
    /**
     * @description Данная функция принимает данные игроков и возвращает цвет шашек для первого и второго игрока 
     * в зависимости от того каким цветом шашек и сколько раз он этим цветом играл играл
     * @param {typeof dummyStats} player1Checkers данные первого игрока
     * @param {typeof dummyStats} player2Checkers данные второго игрока
     * @returns {string[]} массив цветов шашек, для первого и второго игрока
     */
    protected getCheckersColor (player1: IPlayerStatsWithID, player2: IPlayerStatsWithID){
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
    
    /**
     * @description Данная функция принимает данные игрока и новый цвет шашек, и соответствующим образом обновляет 
     * цвет и количество игр сыгранных данным цветом
     * @param playerStats - данные игрока
     * @param color - новый цвет шашек
     */
    /* protected changeCheckersColor(playerStats: IPlayerStatsWithID, color: CheckersColor) {
        const colorUsed = playerStats.colorUsed === 0 || playerStats.lastColor !== color ? 1 : playerStats.colorUsed + 1;
    
        playerStats.colorUsed = colorUsed;
        playerStats.lastColor = color;
    } */
}

export default Draw;