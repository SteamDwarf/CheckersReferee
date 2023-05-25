import { group } from "console";
import { CheckersColor, Game, IGame} from "../models/games.model";
import { IPlayerStats, IPlayerStatsWithID, playerStatsSchema } from "../playerStats/playerStats.model";
import { shuffle, shuffleMutator, splitArrayByItemsCount, splitArrayBySubArraysCount } from "./math";
import { compareByAdamovichRank, compareByScore } from "./playerStats.utils";
import { ObjectId } from "mongodb";
//TODO должны быть чистые функции

//TODO убрать PlayerData
interface IPlayerData {
    playerID: string,
    playerName: string,
    colorUsed: number,
    lastColor: CheckersColor,
    competitorsID: (string | undefined)[]
}

const dummyStats: IPlayerStatsWithID = {
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


export const makeRoundRobinDraw = (tournamentID: string, playersStats: IPlayerStatsWithID[]) => {
    const playersData = playersStats.length % 2 === 0 ? [...playersStats] : [...playersStats, dummyStats];
    const toursCount = playersData.length - 1;
    const games: IGame[] = [];

    for(let i = 0; i < toursCount; i++) {
        for (let j = 0; j < playersData.length / 2; j++) {
            const player1 = playersData[j];
            const player2 = playersData[playersData.length - 1 - j];
            const game = Game(
                tournamentID,
                player1._id.toString(),
                player1.playerName,
                player2._id.toString(),
                player2.playerName
            );

            updateCheckersColor(player1, player2, game);
            

            games.push(game);     
            player1.competitorsID.push(player2._id.toString());
            player2.competitorsID.push(player1._id.toString());
        }
        playersData.splice(1, 0, playersData[playersData.length - 1]);
        playersData.pop();
    }

    return {games, toursCount};
}

export const makeFirstSwissDraw = (tournamentID: string, playersStats: IPlayerStatsWithID[]) => {
    let sortedPlayers = [...playersStats].sort(compareByAdamovichRank) as IPlayerStatsWithID[];
    sortedPlayers = sortedPlayers.length % 2 === 0 ? sortedPlayers : [...sortedPlayers, dummyStats];

    const splitedPlayers = splitArrayByItemsCount(sortedPlayers, 6).map(array => splitArrayBySubArraysCount(array, 2));
    const games: IGame[] = [];
    const toursCount = getSwissToursCount(playersStats.length);

    for(let i = 0; i < splitedPlayers.length; i++) {
        const group = splitedPlayers[i];
        for(let j = 0; j < group[0].length; j++) {
            
            const player1 = group[0][j];
            const player2 = group[1][j];
            const game = Game(tournamentID, player1._id.toString(), player1.playerName, player2._id.toString(), player2.playerName);

            updateCheckersColor(player1, player2, game);
            
            games.push(game);
            player1.competitorsID.push(player2._id.toString());
            player2.competitorsID.push(player1._id.toString());
        }
        
    }

    return {games, toursCount};
}

export const makeSwissDrawAfterTour = (tournamentID: string, playersStats: IPlayerStatsWithID[]) => {
    let games: IGame[] = [];
    let sortedPlayers = [...playersStats].sort(compareByScore) as IPlayerStatsWithID[];

    sortedPlayers = sortedPlayers.length % 2 === 0 ? sortedPlayers : [...sortedPlayers, dummyStats];
    dummyStats.competitorsID = [""];

    const scoreGroups: IPlayerStatsWithID[][] = makeScoreGroups(sortedPlayers);
    const splitedScoreGroups = scoreGroups.map(scoreGroup => splitArrayBySubArraysCount(scoreGroup, 2));
    const pairs = makeDraw(splitedScoreGroups);

    games = pairs.map(pair => {
        const  game = Game(tournamentID, pair[0]._id.toString(), pair[0].playerName, pair[1]._id.toString(), pair[1].playerName);
        updateCheckersColor(pair[0], pair[1], game);
        /* console.log(pair[0].playerName, "color:", pair[0].lastColor, "used:", pair[0].colorUsed);
        console.log(pair[1].playerName, "color:", pair[1].lastColor, "used:", pair[1].colorUsed);
        console.log("=========================================="); */
        console.log(pair[0].playerName, "score:", pair[0].score);
        console.log(pair[1].playerName, "score", pair[1].score);
        console.log("==========================================");
        return game;
    });

    return games;

}

const makeScoreGroups = (sortedPlayers: IPlayerStatsWithID[]) => {
    const players = [...sortedPlayers];
    const scoreGroups = [];

    while(players.length > 0) {
        const player = players.shift();

        if(player && player._id !== dummyStats._id) {
            const score = player.score;
            const scoreGroup: IPlayerStatsWithID[] = [player];

            while(players[0] && players[0].score === score) {
                const otherPlayer = players.shift();
                
                if(otherPlayer) scoreGroup.push(otherPlayer);
            }

            scoreGroups.push(scoreGroup);
        } else if(player && player._id === dummyStats._id) {
            scoreGroups[scoreGroups.length - 1].push(player);
        }
        
    }

    return disturbeGroups(scoreGroups);
}

const disturbeGroups = (scoreGroups: IPlayerStatsWithID[][]) => {
    const disturbedScoreGroups: IPlayerStatsWithID[][] = [];

    scoreGroups.forEach((scoreGroup, i) => {
        if(scoreGroup.length % 2 !== 0 && i + 1 < scoreGroups.length) {
            const lastPlayer = scoreGroup.pop();
            if(lastPlayer) scoreGroups[i + 1].unshift(lastPlayer);
        }

        if(scoreGroup.length !== 0) {
            disturbedScoreGroups.push(scoreGroup);
        }
    });

    return disturbedScoreGroups;
}

const makeDraw = (groups:IPlayerStatsWithID[][][]) => {
    let pairs = [];
    let unPairedPlayers = [];

    for(let i = 0; i < groups.length; i++) {
        const pairingResult = makePairs(groups[i]);
        
        pairs.push(...pairingResult.pairs);

        if(pairingResult.unPairedPlayers.length > 0 && i < groups.length - 1) {
            groups[i + 1][1].unshift(...pairingResult.unPairedPlayers);
        }
        else {
            unPairedPlayers.push(...pairingResult.unPairedPlayers);
        }

    }
    
    while(unPairedPlayers.length > 0) {
        unPairedPlayers.sort(compareByScore);
        pairs = shuffle(pairs);
        
        const subGroup1 = unPairedPlayers.slice(0, Math.floor(unPairedPlayers.length / 2));
        const subGroup2 = unPairedPlayers.slice(Math.floor(unPairedPlayers.length / 2), unPairedPlayers.length);
        const pairingResult = makePairs([subGroup1, subGroup2], pairs);

        unPairedPlayers = [];
        pairs.push(...pairingResult.pairs);
        unPairedPlayers.push(...pairingResult.unPairedPlayers);
    }

    return pairs;
}

function makePairs(group: IPlayerStatsWithID[][], makedPairs?: IPlayerStatsWithID[][]) {
    let pairs: IPlayerStatsWithID[][] = [];
    const untouchablePairs: IPlayerStatsWithID[][] = []
    const unPairedPlayers = [];
    const subGroup1 = group[0];
    const subGroup2 = group[1];
    let unpairedPlayer: undefined | IPlayerStatsWithID = undefined;


    while(subGroup1.length > 0) {
        const player1: IPlayerStatsWithID | undefined = unpairedPlayer ? unpairedPlayer : subGroup1.shift();
        if(!player1) continue;

        const player2 = findCompetitor(player1, group);
        if(!player2) {
            const lastPair = pairs.length > 0 ? pairs.pop() : makedPairs?.pop();

            if(!lastPair) {
                unPairedPlayers.push(player1);
                unpairedPlayer = undefined;
                continue;
            }
            
            lastPair[0].competitorsID.pop();
            lastPair[1].competitorsID.pop();

            unpairedPlayer = player1;
            subGroup1.unshift(lastPair[1]);
            subGroup2.unshift(lastPair[0]);

        } else {
            player1.competitorsID.push(player2._id.toString());
            player2.competitorsID.push(player1._id.toString());
            
            if(unPairedPlayers) {
                untouchablePairs.push([player1, player2]);
                unpairedPlayer = undefined;
            }
            else {
                pairs.push([player1, player2]);
            }

        }
    }

    pairs = [...pairs, ...untouchablePairs];
    unPairedPlayers.push(...subGroup2);

    return {pairs, unPairedPlayers};

}

const findCompetitor = (player1: IPlayerStatsWithID, group: IPlayerStatsWithID[][]) => {
    let subgroup = group[1];
    let competitor = searchInSubgroup(player1, subgroup);

    if(!competitor) {
        subgroup = group[0].reverse();
        competitor = searchInSubgroup(player1, subgroup);
    }

    return competitor;
}

function searchInSubgroup(player1: IPlayerStatsWithID, subgroup: IPlayerStatsWithID[]) {
    for(let i = 0; i < subgroup.length; i++) {
        const player2 = subgroup[i];

        if(!player1.competitorsID.includes(player2._id.toString()) || !player2.competitorsID.includes(player1._id.toString())) {
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

const updateCheckersColor = (player1: IPlayerStatsWithID, player2: IPlayerStatsWithID, game: IGame) => {
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
const getCheckersColor = (player1Checkers: IPlayerStatsWithID, player2Checkers: IPlayerStatsWithID) => {
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
const changeCheckersColor = (checkersData: IPlayerStatsWithID, color: CheckersColor) => {
    const colorUsed = checkersData.colorUsed === 0 || checkersData.lastColor !== color ? 1 : checkersData.colorUsed + 1;

    checkersData.colorUsed = colorUsed;
    checkersData.lastColor = color;
}