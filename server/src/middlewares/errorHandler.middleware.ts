import { NextFunction, Request, Response } from "express";
import { DataBaseError, InternalServerError, ServerError } from "../utils/ServerError";

const errorHandler = (error: ServerError, request: Request, response: Response, next: NextFunction) => {
    const responseError = defineError(error);

    console.error(error);
    response.status(responseError.status || 500).json(responseError);
}

const defineError = (error: ServerError) => {
    if(!error.status) {
        if(error.message === "Document failed validation") {
            return new DataBaseError(error);
        }

        return new InternalServerError();
    }

    return error;
}

export default errorHandler;