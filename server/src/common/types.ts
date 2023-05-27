import { NextFunction, Request, Response, Router } from "express";

export type RouterMethod = keyof Pick<Router, 'get' | 'post' | 'put' | 'delete'>;
export type RequestHandlerAsync = (req: Request, resp: Response, next: NextFunction) => Promise<void>;
export type RequestHandler = (req: Request, resp: Response, next: NextFunction) => void;
