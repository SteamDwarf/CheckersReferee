import { NextFunction, Router, Response, Request } from "express";
import ControllerRoute from "./ControllerRouter";
import { RequestHandler, RequestHandlerAsync } from "./types";

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
            const handler = route.handler.bind(this);
            const middlewares = route.middlewares.map(middleware => middleware.bind(this));

            this._router[route.method](route.url, middlewares, handler);
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

