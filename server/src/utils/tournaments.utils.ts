import { group } from "console";
import { CheckersColor, Game, IGame} from "../models/games.model";
import { IPlayerStats, IPlayerStatsWithID, playerStatsSchema } from "../models/playerStats.model";
import { splitArrayByItemsCount, splitArrayBySubArraysCount } from "./math";
import { compareByAdamovichRank, compareByScore } from "./playerStats.utils";
//TODO должны быть чистые функции

//TODO убрать PlayerData
interface IPlayerData {
    playerID: string,
    playerName: string,
    colorUsed: number,
    lastColor: CheckersColor,
    competitorsID: (string | undefined)[]
}

const dummyStats: IPlayerStats = {
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
    let sortedPlayers = [...playersStats].sort(compareByAdamovichRank) as IPlayerStats[];
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

export const makeSwissDrawAfterTour = (tournamentID: string, playersStats: IPlayerStats[]) => {
    const scoreGroups: IPlayerStats[][] = [];
    let games: IGame[] = [];
    let sortedPlayers = [...playersStats].sort(compareByScore) as IPlayerStats[];

    sortedPlayers = sortedPlayers.length % 2 === 0 ? sortedPlayers : [...sortedPlayers, dummyStats];


    //TODO работать с копией и возвращать изменнную копию playersStats


    

    while(sortedPlayers.length > 0) {
        const player = sortedPlayers.shift();

        if(player) {
            const score = player.score;
            const scoreGroup: IPlayerStats[] = [player];

            while(sortedPlayers[0] && sortedPlayers[0].score === score) {
                const otherPlayer = sortedPlayers.shift();
                
                if(otherPlayer) scoreGroup.push(otherPlayer);
            }
            scoreGroups.push(scoreGroup);
        }
        
    }

    scoreGroups.forEach((scoreGroup, i) => {
        //scoreGroup.sort(compareByAdamovichRank);
        //console.log(scoreGroup.length);


        if(scoreGroup.length % 2 !== 0 && i + 1 < scoreGroups.length) {
            const lastPlayer = scoreGroup.pop();
            if(lastPlayer) scoreGroups[i + 1].unshift(lastPlayer);
        }
    });

    const splitedScoreGroups = scoreGroups.map(scoreGroup => splitArrayBySubArraysCount(scoreGroup, 2));
    const pairs = makeDraw(splitedScoreGroups);
    console.log("ПАРЫ=========================");
    console.log(pairs);
    games = pairs.map(pair => Game(tournamentID, pair[0].playerID, pair[0].playerName, pair[1].playerID, pair[1].playerName));
    //console.log(unmatchedPlayers.length);
    //console.log(unmatchedPlayers.map(player => player?._id));

    return games;

}

const makeDraw = (groups:IPlayerStats[][][]) => {
    const pairs = [];
    let unPairedPlayers = [];

    for(let i = 0; i < groups.length; i++) {
        const pairingResult = makePairs(groups[i]);

        pairs.push(...pairingResult.pairs);
        unPairedPlayers.push(...pairingResult.unPairedPlayers);
    }

    if(unPairedPlayers) {
        unPairedPlayers.sort(compareByScore);

        const subGroup1 = unPairedPlayers.slice(0, Math.floor(unPairedPlayers.length / 2));
        const subGroup2 = unPairedPlayers.slice(Math.floor(unPairedPlayers.length / 2), unPairedPlayers.length);
        const pairingResult = makePairs([subGroup1, subGroup2]);

        unPairedPlayers = [];
        pairs.push(...pairingResult.pairs);
        unPairedPlayers.push(...pairingResult.unPairedPlayers);
    }

    return pairs;
}

function makePairs(group: IPlayerStats[][]) {
    const pairs: IPlayerStats[][] = [];
    const unPairedPlayers = [];
    const subGroup1 = group[0];
    const subGroup2 = group[1];
    let unpairedPlayer: undefined | IPlayerStats = undefined;
    
    while(subGroup1.length > 0) {
        const player1: IPlayerStats | undefined = unpairedPlayer ? unpairedPlayer : subGroup1.shift();

        if(player1) {
            const player2 = findCompetitor(player1, group);

            if(!player2) {
                const lastPair = pairs.pop();
                
                if(!lastPair) {
                    unPairedPlayers.push(player1);
                    continue;
                }
                
                lastPair[0].competitorsID.pop();
                lastPair[1].competitorsID.pop();
    
                unpairedPlayer = player1;
                subGroup1.unshift(lastPair[1]);
                subGroup2.unshift(lastPair[0]);
    
            } else {
                player1.competitorsID.push(player2.playerID);
                player2.competitorsID.push(player1.playerID);
                
                pairs.push([player1, player2]);
    
                if(unpairedPlayer) unpairedPlayer = undefined;
            }
        }
        
        
    }

    unPairedPlayers.push(...subGroup2);

    return {pairs, unPairedPlayers};

}

const findCompetitor = (player1: IPlayerStats, group: IPlayerStats[][]) => {
    let subgroup = group[1];
    let competitor = searchInSubgroup(player1, subgroup);

    if(!competitor) {
        subgroup = group[0].reverse();
        competitor = searchInSubgroup(player1, subgroup);
    }

    return competitor;
}

function searchInSubgroup(player1: IPlayerStats, subgroup: IPlayerStats[]) {
    for(let i = 0; i < subgroup.length; i++) {
        const player2 = subgroup[i];

        if(!player2.competitorsID.includes(player1.playerID)) {
            subgroup.splice(subgroup.indexOf(player2), 1);
            return player2;
        }
    }
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