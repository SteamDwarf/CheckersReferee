import { CheckersColor, Game, IGame} from "../models/games.model";
import { IPlayerStats, playerStatsSchema } from "../models/playerStats.model";
import { splitArrayByItemsCount, splitArrayBySubArraysCount } from "./math";
import { compareByAdamovichRank } from "./playerStats.utils";
//TODO должны быть чистые функции
interface IPlayerData {
    playerID: string,
    playerName: string,
    colorUsed: number,
    lastColor: CheckersColor,
    competitorsID: (string | undefined)[]
}

const dummyStats = {
    playerID: "0",
    playerName: "",
    colorUsed: 0,
    lastColor: CheckersColor.black,
    competitorsID: [""]
}


export const makeRoundRobinDraw = (tournamentID: string, playersStats: IPlayerStats[]) => {
    const playersData = playersStats.length % 2 === 0 ? [...playersStats] : [...playersStats, dummyStats];
    const toursCount = playersData.length - 1;
    const games: IGame[] = [];

    for(let i = 0; i < toursCount; i++) {
        for (let j = 0; j < playersData.length / 2; j++) {
            const player1 = playersData[j];
            const player2 = playersData[playersData.length - 1 - j];
            const game = Game(
                tournamentID,
                player1.playerID,
                player1.playerName,
                player2.playerID,
                player2.playerName
            );

            updateCheckersColor(player1, player2, game);
            

            games.push(game);     
            player1.competitorsID.push(player2.playerID);
            player2.competitorsID.push(player1.playerID);
        }
        playersData.splice(1, 0, playersData[playersData.length - 1]);
        playersData.pop();
    }

    return {games, toursCount};
}

export const makeFirstSwissDraw = (tournamentID: string, playersStats: IPlayerStats[]) => {
    let sortedPlayers = [...playersStats].sort(compareByAdamovichRank) as IPlayerData[];
    sortedPlayers = sortedPlayers.length % 2 === 0 ? sortedPlayers : [...sortedPlayers, dummyStats];

    const splitedPlayers = splitArrayByItemsCount(sortedPlayers, 6).map(array => splitArrayBySubArraysCount(array, 2));
    const games: IGame[] = [];
    const toursCount = getSwissToursCount(playersStats.length);

    for(let i = 0; i < splitedPlayers.length; i++) {
        const group = splitedPlayers[i];
        for(let j = 0; j < group[0].length; j++) {
            
            const player1 = group[0][j];
            const player2 = group[1][j];
            const game = Game(tournamentID, player1.playerID, player1.playerName, player2.playerID, player2.playerName);

            updateCheckersColor(player1, player2, game);
            
            games.push(game);
            player1.competitorsID.push(player2.playerID);
            player2.competitorsID.push(player1.playerID);
        }
        
    }

    return {games, toursCount};
}

const getSwissToursCount = (playersCount: number) => {
    if(playersCount >= 11 && playersCount <= 20) return 7;
    if(playersCount >= 21 && playersCount <= 30) return 8;
    if(playersCount >= 31 && playersCount <= 40) return 9;
    if(playersCount >= 41 && playersCount <= 50) return 10;
    return 11;
}

const updateCheckersColor = (player1: IPlayerData, player2: IPlayerData, game: IGame) => {
    if(!player1.playerName || !player2.playerName) {
        return;
    }

    const colors = getCheckersColor(player1, player2);

    changeCheckersColor(player1, colors[0]);
    game.player1CheckersColor = colors[0];

    changeCheckersColor(player2, colors[1]);
    game.player2CheckersColor = colors[1];

    //console.log(player1.playerName, player1.lastColor, player1.colorUsed);
    //console.log(player2.playerName, player2.lastColor, player2.colorUsed);
}

/**
 * @description Данная функция принимает данные игроков и возвращает цвет шашек для первого и второго игрока 
 * в зависимости от того каким цветом шашек и сколько раз он этим цветом играл играл
 * @param {typeof dummyStats} player1Checkers данные первого игрока
 * @param {typeof dummyStats} player2Checkers данные второго игрока
 * @returns {string[]} массив цветов шашек, для первого и второго игрока
 */
const getCheckersColor = (player1Checkers: IPlayerData, player2Checkers: IPlayerData) => {
    if(!player1Checkers.colorUsed && !player2Checkers.colorUsed) {
        return [CheckersColor.white, CheckersColor.black];
    }

    if(player1Checkers.lastColor !== player2Checkers.lastColor) {
        return [player2Checkers.lastColor, player1Checkers.lastColor];
    }

    if(player1Checkers.colorUsed > player2Checkers.colorUsed) {
        return [reverseCheckersColor(player1Checkers.lastColor), player2Checkers.lastColor];
    } else {
        return [player1Checkers.lastColor, reverseCheckersColor(player2Checkers.lastColor)];
    }
}

/**
 * @description Данная функция меняет цвет шашек на противоположный
 * @param {string} color - цвет шашек
 * @returns {string} противоположный цвет шашек
 */
const reverseCheckersColor = (color: CheckersColor) => {
    return color === CheckersColor.white ? CheckersColor.black : CheckersColor.white;
}

/**
 * @description Данная функция принимает данные игрока и новый цвет шашек, и соответствующим образом обновляет 
 * цвет и количество игр сыгранных данным цветом
 * @param checkersData - данные игрока
 * @param color - новый цвет шашек
 */
const changeCheckersColor = (checkersData: IPlayerData, color: CheckersColor) => {
    const colorUsed = checkersData.colorUsed === 0 || checkersData.lastColor !== color ? 1 : checkersData.colorUsed + 1;

    checkersData.colorUsed = colorUsed;
    checkersData.lastColor = color;
}