import GameService from "../games/Game.service";
import { Game, IGame, IGameWithId } from "../models/games.model";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import Draw from "./Draw";

class RoundRobinDraw extends Draw{
    constructor(gameService: GameService, playerStatsService: PlayerStatsService) {
        super(gameService, playerStatsService);
    }

    public async makeStartDraw(tournamentID: string, playersStats: IPlayerStatsWithID[]) {
        const playersData = playersStats.length % 2 === 0 ? [...playersStats] : [...playersStats, this.fakePlayer];
        const toursCount = playersData.length - 1;
        const games: IGameWithId[] = [];

        for(let i = 0; i < toursCount; i++) {
            for (let j = 0; j < playersData.length / 2; j++) {
                const player1 = playersData[j];
                const player2 = playersData[playersData.length - 1 - j];
                const checkersColor = this.getCheckersColor(player1, player2);
                const game = await this.gameService.createGame(
                    tournamentID,
                    player1,
                    player2,
                    checkersColor
                );
            
                games.push(game);     
                
                //TODO разобраться с этим
                if(checkersColor) {
                    this.changeCheckersColor(player1, checkersColor[0]);
                    this.changeCheckersColor(player2, checkersColor[1]);

                    console.log(player1.playerName, player1.lastColor, player1.colorUsed);
                    console.log(player2.playerName, player2.lastColor, player2.colorUsed);
                }
                
                //TODO разобраться с этим
                player1.competitorsID.push(player2._id.toString());
                player2.competitorsID.push(player1._id.toString());
                
                await this.playerStatsService.updatePlayerStats(player1);
                await this.playerStatsService.updatePlayerStats(player2);
            }
            playersData.splice(1, 0, playersData[playersData.length - 1]);
            playersData.pop();
        }

        return {games, toursCount};
    }
}

export default RoundRobinDraw;