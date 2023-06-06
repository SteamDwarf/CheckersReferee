import { ContainerModule, interfaces } from "inversify";
import { CONTROLLERS, REPOSITORIES, SERVICES } from "../common/injectables.types";
import DocumentsService from "./Documents.service";
import DocumentsController from "./Documents.controller";
import DocumentsRepository from "./Documents.repository";

const documentsBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<DocumentsService>(SERVICES.Document).to(DocumentsService);
    bind<DocumentsController>(CONTROLLERS.Document).to(DocumentsController);
    bind<DocumentsRepository>(REPOSITORIES.Document).to(DocumentsRepository);
});

export default documentsBindings;