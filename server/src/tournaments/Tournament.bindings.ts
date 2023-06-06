import { ContainerModule, interfaces } from "inversify";
import TournamentService from "./Tournament.service";
import TournamentController from "./Tournament.controller";
import { CONTROLLERS, REPOSITORIES, SERVICES } from "../common/injectables.types";
import TournamentRepository from "./Tournament.repository";

const tournamentBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<TournamentService>(SERVICES.Tournament).to(TournamentService).inSingletonScope();
    bind<TournamentController>(CONTROLLERS.Tournament).to(TournamentController);
    bind<TournamentRepository>(REPOSITORIES.Tournament).to(TournamentRepository);
});

export default tournamentBindings;