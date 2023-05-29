import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, SERVICES } from "../common/injectables.types";
import PlayerStatsController from "./PlayerStats.controller";
import PlayerStatsService from "./PlayerStats.service";

const playerStatsBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<PlayerStatsController>(CONTROLLERS.PlayerStats).to(PlayerStatsController);
    bind<PlayerStatsService>(SERVICES.PlayerStats).to(PlayerStatsService);

});

export default playerStatsBindings;