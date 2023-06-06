import GameService from "../games/Games.service";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import Utils from "../utils/Utils";
import Draw from "./Draw";
import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";
import GamePlain from "../games/GamePlain.entity";

class RoundRobinDraw extends Draw{
    constructor(gameService: GameService, playerStatsService: PlayerStatsService, utils: Utils) {
        super(utils);
    }

    public async makeStartDraw(tournamentID: string, playersStats: PlayerStatsDocument[]) {
        const playersData = playersStats.length % 2 === 0 ? [...playersStats] : [...playersStats, this.fakePlayer];
        const toursCount = playersData.length - 1;
        const games: GamePlain[] = [];

        for(let i = 0; i < toursCount; i++) {
            for (let j = 0; j < playersData.length / 2; j++) {
                const player1 = playersData[j];
                const player2 = playersData[playersData.length - 1 - j];
                const game = await this.makeGame(tournamentID, player1, player2);

                player1.lastColor = game.player1CheckersColor;
                player1.addCompetitor(player2.id);

                player2.lastColor = game.player2CheckersColor;
                player2.addCompetitor(player1.id);


                games.push(game);

                console.log(player1.playerName, player1.lastColor, player1.colorUsed);
                console.log(player2.playerName, player2.lastColor, player2.colorUsed);
                console.log("==========================================================")
            }

            playersData.splice(1, 0, playersData[playersData.length - 1]);
            playersData.pop();
        }

        return {games, toursCount};
    }
}

export default RoundRobinDraw;