import { IMiddleware, IMiddlewareAsync } from "./interfaces";
import { RequestHandler, RequestHandlerAsync, RouterMethod } from "./types";

class ControllerRoute {
    private readonly _url;
    private readonly _method;
    private readonly _middlewares;
    private readonly _handler;

    constructor(
        url: string, 
        method: RouterMethod, 
        middlewares: IMiddleware[],
        handler: RequestHandlerAsync
    ) {
        this._url = url;
        this._method = method;
        this._middlewares = middlewares;
        this._handler = handler;

    }

    get url() {
        return this._url;
    }
    get method() {
        return this._method;
    }
    get handler() {
        return this._handler;
    }
    get middlewares() {
        return this._middlewares;
    }
}

export default ControllerRoute;