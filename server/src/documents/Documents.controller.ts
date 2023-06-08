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
            new ControllerRoute("/player-certificate", "get", [], this.getPlayerSertificate),
            new ControllerRoute("/rank-list", "get", [], this.getRankList)
        ]);

    }

    public async getPlayerSertificate(request: Request, response: Response) {
        const playerStatsID = request.query.playerStatsID?.toString();

        if(!playerStatsID) {
            throw new InputError("Вы не указали id статистики игрока.")
        }

        const playerCertificateLink = await this._documentsService.getPlayerCertificate(playerStatsID);
        response.json(playerCertificateLink)
    }

    public async getRankList(request: Request, response: Response) {
        const tournamentID = request.query.tournamentID?.toString();

        if(!tournamentID) {
            throw new InputError("Вы не указали id турнира.")
        }

        const rankListLink = await this._documentsService.getRankList(tournamentID);
        response.json(rankListLink);
    }
}

export default DocumentsController;