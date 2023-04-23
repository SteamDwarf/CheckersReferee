import { CheckersColor, Game, IGame} from "../models/games.model";
import { IPlayerStats } from "../models/playerStats.model";
//TODO должны быть чистые функции

interface ICheckersData {
    playerID: string,
    playerName: string,
    colorUsed: number,
    lastColor: CheckersColor
}

const dummyStats = {
    playerID: "0",
    playerName: "",
    colorUsed: 0,
    lastColor: CheckersColor.black
}

const CheckersData = (playerStats: IPlayerStats): ICheckersData => {
    return {
        playerID: playerStats.playerID,
        playerName: playerStats.playerName,
        colorUsed: 0,
        lastColor: CheckersColor.black
    }
}

//TODO??? должно возвращать количество туров
export const makeRoundRobinDraw = (tournamentID: string, playersStats: IPlayerStats[]) => {
    let checkersData = playersStats.map(playerStats => CheckersData(playerStats));
    checkersData = checkersData.length % 2 === 0 ? checkersData : [...checkersData, dummyStats];

    //const players = playersStats.length % 2 === 0 ? playersStats : [...playersStats, dummyStats];
    const toursCount = checkersData.length - 1;
    const games: IGame[] = [];

    for(let i = 0; i < toursCount; i++) {
        for (let j = 0; j < checkersData.length / 2; j++) {
            const player1 = checkersData[j];
            const player2 = checkersData[checkersData.length - 1 - j];
            const game = Game(
                tournamentID,
                player1.playerID,
                player1.playerName,
                player2.playerID,
                player2.playerName
            );

            if(player1.playerName && player2.playerName) {
                const colors = getCheckersColor(player1, player2);

                updateColorData(player1, colors[0]);
                game.player1CheckersColor = colors[0];

                updateColorData(player2, colors[1]);
                game.player2CheckersColor = colors[1];

                console.log(player1.playerName, player1.lastColor, player1.colorUsed);
                console.log(player2.playerName, player2.lastColor, player2.colorUsed);
            }
            

            games.push(game);            
        }
        checkersData.splice(1, 0, checkersData[checkersData.length - 1]);
        checkersData.pop();
    }

    return games;
}

const getCheckersColor = (player1Checkers: ICheckersData, player2Checkers: ICheckersData) => {
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

const reverseCheckersColor = (color: CheckersColor) => {
    return color === CheckersColor.white ? CheckersColor.black : CheckersColor.white;
}

const updateColorData = (checkersData: ICheckersData, color: CheckersColor) => {
    const colorUsed = checkersData.colorUsed === 0 || checkersData.lastColor === color ? 1 : 0;

    checkersData.colorUsed = checkersData.colorUsed + colorUsed;
    checkersData.lastColor = color;
}