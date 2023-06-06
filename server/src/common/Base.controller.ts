import { NextFunction, Router, Response, Request } from "express";
import ControllerRoute from "./ControllerRouter";
import { RequestHandler, RequestHandlerAsync } from "./types";
import { injectable } from "inversify";

@injectable()
abstract class BaseController{
    private readonly _router;

    constructor() {
        this._router = Router();
    }

    get router() {
        return this._router;
    }

    protected initRoutes(routes: ControllerRoute[]) {
        routes.forEach(route => {
            const handler = this.asyncHandler(route.handler.bind(this));
            const middlewares = route.middlewares.map(middleware => middleware.execute.bind(middleware));
            
            this._router[route.method](route.url, middlewares, handler);
        });
    }

    protected asyncHandler (callback: RequestHandlerAsync) {
        return async (req: Request, resp: Response, next: NextFunction) => {
            try{
                const handler = callback.bind(this);
                await handler(req, resp, next);
            }catch(error) {
                next(error);
            }
        }
    }

    protected paginateData <T>(dataArray: T[], limit: number, page: number){
        const startInd = (page - 1) * limit;
        const endInd = limit * page;
        return dataArray.slice(startInd, endInd)
    }
}

export default BaseController;

