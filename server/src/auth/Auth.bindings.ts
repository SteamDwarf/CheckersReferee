import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, SERVICES } from "../common/injectables.types";
import AuthController from "./Auth.controller";
import AuthService from "./Auth.service";

const authBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<AuthController>(CONTROLLERS.Auth).to(AuthController);
    bind<AuthService>(SERVICES.Auth).to(AuthService);
});

export default authBindings;