import { NextFunction, Request, Response } from "express";
import { ServerError } from "./Server.error";
import { DataBaseError } from "./DataBase.error";
import { InternalServerError } from "./InternalServer.error";
//TODO Переделать в классы

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
                return new DataBaseError(error);
            }
    
            return new InternalServerError();
        }
    
        return error;
    }
}

export default ErrorHandler;