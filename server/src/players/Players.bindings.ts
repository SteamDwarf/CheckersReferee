import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, REPOSITORIES, SERVICES } from "../common/injectables.types";
import PlayerController from "./Players.controller";
import PlayerService from "./Players.service";
import PlayerRepository from "./Players.repository";

const playerBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<PlayerController>(CONTROLLERS.Player).to(PlayerController);
    bind<PlayerService>(SERVICES.Player).to(PlayerService);
    bind<PlayerRepository>(REPOSITORIES.Player).to(PlayerRepository);
});

export default playerBindings;