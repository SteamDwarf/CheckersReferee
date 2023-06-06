import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, REPOSITORIES, SERVICES } from "../common/injectables.types";
import AuthController from "./Auth.controller";
import AuthService from "./Auth.service";
import AuthRepository from "./Auth.repository";

const authBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<AuthController>(CONTROLLERS.Auth).to(AuthController);
    bind<AuthService>(SERVICES.Auth).to(AuthService);
    bind<AuthRepository>(REPOSITORIES.Auth).to(AuthRepository);
});

export default authBindings;