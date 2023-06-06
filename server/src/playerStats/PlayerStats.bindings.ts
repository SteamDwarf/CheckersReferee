import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, REPOSITORIES, SERVICES } from "../common/injectables.types";
import PlayerStatsController from "./PlayerStats.controller";
import PlayerStatsService from "./PlayerStats.service";
import PlayerStatsRepository from "./PlayerStats.repository";

const playerStatsBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<PlayerStatsController>(CONTROLLERS.PlayerStats).to(PlayerStatsController);
    bind<PlayerStatsService>(SERVICES.PlayerStats).to(PlayerStatsService);
    bind<PlayerStatsRepository>(REPOSITORIES.PlayerStats).to(PlayerStatsRepository);
});

export default playerStatsBindings;