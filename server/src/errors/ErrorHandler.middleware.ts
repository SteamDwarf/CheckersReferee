import { NextFunction, Request, Response } from "express";
import { ServerError } from "./Server.error";
import { DataBaseError } from "./DataBase.error";
import { InternalServerError } from "./InternalServer.error";
import { injectable } from "inversify";
import { MongoServerError } from "mongodb";
import { AuthError } from "./Auth.error";
import { ForbiddenError } from "./Forbidden.error";

@injectable()
class ErrorHandler {
    public handleError(error: ServerError, request: Request, response: Response, next: NextFunction) {
        const responseError = this.defineError(error);

        console.error(error);
        response.status(responseError.status || 500).json(responseError);
    }

    public handleNotFoundError(request: Request, response: Response){
        response.status(404).json({
            status: 404,
            message: "Ресурс не найден 404"
        });
    }

    private defineError(error: ServerError) {
        if(!error.status) {
            if(error.message === "Document failed validation") {
                console.log((error as MongoServerError)?.errInfo?.details?.schemaRulesNotSatisfied[0]?.propertiesNotSatisfied);
                return new DataBaseError(error);
            } else if(error.name === "JsonWebTokenError") {
                return new ForbiddenError("Недостаточно прав доступа.");
            }
    
            return new InternalServerError();
        }
    
        return error;
    }
}

export default ErrorHandler;