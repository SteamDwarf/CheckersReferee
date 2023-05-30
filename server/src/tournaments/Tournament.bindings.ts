import { ContainerModule, interfaces } from "inversify";
import TournamentService from "./Tournament.service";
import TournamentController from "./Tournament.controller";
import { CONTROLLERS, SERVICES } from "../common/injectables.types";

const tournamentBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<TournamentService>(SERVICES.Tournament).to(TournamentService).inSingletonScope();
    bind<TournamentController>(CONTROLLERS.Tournament).to(TournamentController);
});

export default tournamentBindings;