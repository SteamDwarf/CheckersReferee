import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, SERVICES } from "../common/injectables.types";
import GameService from "./Game.service";
import GameController from "./Game.controller";

const gameBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<GameService>(SERVICES.Game).to(GameService);
    bind<GameController>(CONTROLLERS.Game).to(GameController);
});

export default gameBindings;