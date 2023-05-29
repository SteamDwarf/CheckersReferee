import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, SERVICES } from "../common/injectables.types";
import SportsCategoryService from "./SportsCategory.service";
import SportsCategoryController from "./SportsCategory.controller";

const sportsCategoriesBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<SportsCategoryService>(SERVICES.SportsCategory).to(SportsCategoryService);
    bind<SportsCategoryController>(CONTROLLERS.SportsCategory).to(SportsCategoryController);
});

export default sportsCategoriesBindings;