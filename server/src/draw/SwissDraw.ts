import GameService from "../games/Game.service";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import Draw from "./Draw";

class SwissDraw extends Draw {
    constructor(gameService: GameService, playerStatsService: PlayerStatsService) {
        super(gameService, playerStatsService);
    }

    public async makeStartDraw() {
        return;
    }
}

export default SwissDraw;