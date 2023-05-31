import { NextFunction, Request, Response, Router } from "express";
import PlayerSertificatePlain from "../documents/PlayerSertificatePlain.entity";
import PlayerSertificateOptions from "../documents/documentOptions/PlayerSertificate.options";

export type RouterMethod = keyof Pick<Router, 'get' | 'post' | 'put' | 'delete'>;
export type RequestHandlerAsync = (req: Request, resp: Response, next: NextFunction) => Promise<void>;
export type RequestHandler = (req: Request, resp: Response, next: NextFunction) => void;
export type DocumentsType = PlayerSertificatePlain;
export type DocumentsOptions = typeof PlayerSertificateOptions;