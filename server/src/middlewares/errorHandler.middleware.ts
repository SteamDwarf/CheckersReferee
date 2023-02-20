import { NextFunction, Request, Response } from "express";
import { DataBaseError, ServerError } from "../utils/ServerError";

const errorHandler = (error: ServerError, request: Request, response: Response, next: NextFunction) => {
    const responseError = defineError(error);

    console.error(responseError);
    response.status(responseError.status || 500).json(responseError);
}

const defineError = (error: ServerError) => {
    if(!error.status) {
        if(error.message === "Document failed validation") {
            return new DataBaseError(error);
        }

        return new ServerError("Ошибка сервера", "Внутрення ошибка сервера", 500);
    }

    return error;
}

export default errorHandler;