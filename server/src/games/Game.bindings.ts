import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, REPOSITORIES, SERVICES } from "../common/injectables.types";
import GamesRepository from "./Games.repository";
import GamesService from "./Games.service";
import GamesController from "./Games.controller";

const gameBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<GamesService>(SERVICES.Game).to(GamesService);
    bind<GamesController>(CONTROLLERS.Game).to(GamesController);
    bind<GamesRepository>(REPOSITORIES.Game).to(GamesRepository);
});

export default gameBindings;