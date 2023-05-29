import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, SERVICES } from "../common/injectables.types";
import PlayerController from "./Player.controller";
import PlayerService from "./Player.service";

const playerBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<PlayerController>(CONTROLLERS.Player).to(PlayerController);
    bind<PlayerService>(SERVICES.Player).to(PlayerService);
});

export default playerBindings;