import { NextFunction, Request, Response } from "express";
import { RequestHandlerAsync } from "./types";

abstract class BaseMiddlewareAsync {
    //TODO разобраться
    /* protected _execute(req: Request, resp: Response, next: NextFunction) {
        return Promise<void>;
    }

    public execute() {
        return this.asyncHandler(this._execute.bind(this));
    } */

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
}

export default BaseMiddlewareAsync;