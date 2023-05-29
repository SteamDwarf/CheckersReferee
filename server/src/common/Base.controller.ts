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
            const asyncMiddlewares = route.asyncMiddlewares.map(middleware => this.asyncHandler(middleware.execute.bind(middleware)));
            
            this._router[route.method](route.url, middlewares, asyncMiddlewares, handler);
        });
    }

    protected asyncHandler (callback: RequestHandlerAsync) {
        return async (req: Request, resp: Response, next: NextFunction) => {
            try{
                const handler = callback.bind(this);
                await handler(req, resp, next);
            }catch(error) {
                console.error("ERRRRRor");
                next(error);
            }
        }
    }
}

export default BaseController;

