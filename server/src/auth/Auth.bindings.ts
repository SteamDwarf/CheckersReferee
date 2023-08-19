import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, MIDDLEWARES, REPOSITORIES, SERVICES } from "../common/injectables.types";
import AuthController from "./Auth.controller";
import AuthService from "./Auth.service";
import AuthRepository from "./Auth.repository";
import JWTService from "../jwt/JWT.service";
import AuthMiddleware from "./Auth.middleware";

const authBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<AuthController>(CONTROLLERS.Auth).to(AuthController);
    bind<AuthService>(SERVICES.Auth).to(AuthService);
    bind<AuthRepository>(REPOSITORIES.Auth).to(AuthRepository);
    bind<AuthMiddleware>(MIDDLEWARES.Auth).to(AuthMiddleware);
    bind<JWTService>(SERVICES.JWT).to(JWTService);
});

export default authBindings;