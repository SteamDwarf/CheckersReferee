import GameService from "../games/Game.service";
import { Game, IGame, IGameWithId } from "../games/games.model";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import Utils from "../utils/Utils";
import Draw from "./Draw";

class RoundRobinDraw extends Draw{
    constructor(gameService: GameService, playerStatsService: PlayerStatsService, utils: Utils) {
        super(gameService, playerStatsService, utils);
    }

    public async makeStartDraw(tournamentID: string, playersStats: IPlayerStatsWithID[]) {
        const playersData = playersStats.length % 2 === 0 ? [...playersStats] : [...playersStats, this.fakePlayer];
        const toursCount = playersData.length - 1;
        const games: IGameWithId[] = [];

        for(let i = 0; i < toursCount; i++) {
            for (let j = 0; j < playersData.length / 2; j++) {
                const player1 = playersData[j];
                const player2 = playersData[playersData.length - 1 - j];
                const game = await this.makeGame(tournamentID, player1, player2);
                
                games.push(game);  
                
                await this.playerStatsService.updateAfterDraw(player1, game.player1CheckersColor, player2._id.toString());
                await this.playerStatsService.updateAfterDraw(player2, game.player2CheckersColor, player1._id.toString());
            }

            playersData.splice(1, 0, playersData[playersData.length - 1]);
            playersData.pop();
        }

        return {games, toursCount};
    }
}

export default RoundRobinDraw;