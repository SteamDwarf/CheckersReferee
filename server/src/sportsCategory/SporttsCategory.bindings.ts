import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, REPOSITORIES, SERVICES } from "../common/injectables.types";
import SportsCategoryService from "./SportsCategory.service";
import SportsCategoryController from "./SportsCategory.controller";
import SportsCategoryRepository from "./SportsCategory.repository";

const sportsCategoriesBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<SportsCategoryService>(SERVICES.SportsCategory).to(SportsCategoryService);
    bind<SportsCategoryController>(CONTROLLERS.SportsCategory).to(SportsCategoryController);
    bind<SportsCategoryRepository>(REPOSITORIES.SportsCategory).to(SportsCategoryRepository);
});

export default sportsCategoriesBindings;