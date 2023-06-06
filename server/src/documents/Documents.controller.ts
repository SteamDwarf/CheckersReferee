import { inject, injectable } from "inversify";
import { SERVICES } from "../common/injectables.types";
import DocumentsService from "./Documents.service";
import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import { Request, Response } from "express";
import { InputError } from "../errors/Input.error";

@injectable()
class DocumentsController extends BaseController{
    constructor(
        @inject(SERVICES.Document) private readonly _documentsService: DocumentsService,
    ) {
        super();
        this.initRoutes([
            new ControllerRoute("/player-certificate", "get", [], this.getPlayerSertificate)
        ]);

    }

    public async getPlayerSertificate(request: Request, response: Response) {
        const playerStatsID = request.query.playerStatsID?.toString();

        if(!playerStatsID) {
            throw new InputError("Вы не указали id статистики игрока.")
        }

        const playerCertificatePath = await this._documentsService.getPlayerCertificate(playerStatsID);
        response.json(playerCertificatePath)
    }
}

export default DocumentsController;