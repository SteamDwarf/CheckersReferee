import { ObjectId } from "mongodb";
import { getRandomItem } from "./math";
import { IPlayerDocumentWithId } from "../models/players.model";
import { CheckersColor, Game, IGame} from "../models/games.model";
import { getPlayerName } from "./player.utils";
import { IPlayerStats, IPlayerStatsWithID } from "../models/playerStats.model";

const dummyStats = {
    playerID: "0",
    playerName: "",
    checkersColorUsed: 0,
    lastCheckersColor: CheckersColor.black
}
//TODO должно возвращать количество туров
export const makeRoundRobinDraw = (tournamentID: string, playersStats: IPlayerStats[]) => {
    const players = playersStats.length % 2 === 0 ? playersStats : [...playersStats, dummyStats];
    const toursCount = players.length - 1;
    const games: IGame[] = [];

    for(let i = 0; i < toursCount; i++) {
        for (let j = 0; j < players.length / 2; j++) {
            const player1 = players[j];
            const player2 = players[players.length - 1 - j];
            const game = Game(
                tournamentID,
                player1.playerID,
                player1.playerName,
                player2.playerID,
                player2.playerName
            );

            if(player1.playerName && player2.playerName) {
                const colors = getCheckersColor(player1, player2);

                updateColor(player1, colors[0]);
                game.player1CheckersColor = colors[0];

                updateColor(player2, colors[1]);
                game.player2CheckersColor = colors[1];

                console.log(player1.playerName, player1.lastCheckersColor, player1.checkersColorUsed);
                console.log(player2.playerName, player2.lastCheckersColor, player2.checkersColorUsed);
            }
            

            games.push(game);            
        }
        players.splice(1, 0, players[players.length - 1]);
        players.pop();
    }

    return games;
}

const getCheckersColor = (player1Stats: typeof dummyStats, player2Stats: typeof dummyStats) => {
    if(!player1Stats.checkersColorUsed && !player2Stats.checkersColorUsed) {
        return [CheckersColor.white, CheckersColor.black];
    }

    if(player1Stats.lastCheckersColor !== player2Stats.lastCheckersColor) {
        return [player2Stats.lastCheckersColor, player1Stats.lastCheckersColor];
    }

    if(player1Stats.checkersColorUsed > player2Stats.checkersColorUsed) {
        return [reverseCheckersColor(player1Stats.lastCheckersColor), player2Stats.lastCheckersColor];
    } else {
        return [player1Stats.lastCheckersColor, reverseCheckersColor(player2Stats.lastCheckersColor)];
    }
}

const reverseCheckersColor = (color: CheckersColor) => {
    return color === CheckersColor.white ? CheckersColor.black : CheckersColor.white;
}

const updateColor = (playerStat: typeof dummyStats, color: CheckersColor) => {
    const colorUsed = playerStat.checkersColorUsed === 0 || playerStat.lastCheckersColor === color ? 1 : 0;

    playerStat.checkersColorUsed = playerStat.checkersColorUsed + colorUsed;
    playerStat.lastCheckersColor = color;
}