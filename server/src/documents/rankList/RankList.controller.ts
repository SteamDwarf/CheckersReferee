import { inject, injectable } from "inversify";
import BaseController from "../../common/Base.controller";
import { MIDDLEWARES, SERVICES } from "../../common/injectables.types";
import RankListService from "./RankList.service";
import { Request, Response } from "express";
import ControllerRoute from "../../common/ControllerRouter";
import RankListMiddleware from "./RankList.middleware";

@injectable()
class RankListController extends BaseController {
    constructor(
        @inject(MIDDLEWARES.RankList) private readonly _rankListMiddleware: RankListMiddleware,
        @inject(SERVICES.RankList) private readonly _rankListService: RankListService
    ) {
        super();

        this.initRoutes([
            new ControllerRoute("/rank-list/", "get", 
            [], 
            [],
            this.asyncHandler(this.get))
        ]);
    }

    public async get(request: Request, response: Response) {
        const tournamentID = request.query.tournamentID?.toString();
        const rankList = await this._rankListService.getRankList(tournamentID as string);
        
        response.json(rankList);
    }
}

export default RankListController;