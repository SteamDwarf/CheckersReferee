import { NextFunction, Request, Response } from "express";

//TODO разобраться
export interface IMiddleware {
    execute: (request: Request, response: Response, next: NextFunction) => void;
}

export interface IMiddlewareAsync {
    execute: (request: Request, response: Response, next: NextFunction) => Promise<void>;
}

export interface IJWTPayload {
    login: string,
    iat: string
}