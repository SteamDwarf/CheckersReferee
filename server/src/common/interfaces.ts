import { NextFunction, Request, Response } from "express";

export interface IMiddleware {
    execute: (request: Request, response: Response, next: NextFunction) => void;
}

export interface IMiddlewareAsync {
    execute: (request: Request, response: Response, next: NextFunction) => Promise<void>;
}
