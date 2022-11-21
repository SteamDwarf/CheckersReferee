import { NextFunction, Request, Response } from "express";

//TODO переделать 
const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
    const responseStatus = response.statusCode && response.statusCode !== 200 ? response.statusCode : 500;
    const errorMessage = responseStatus === 500 ? "Внутрення ошибка сервера" : error.message;

    console.error(error.message);
    response.status(responseStatus).json({
        status: responseStatus, 
        message: errorMessage
    });
}

export default errorHandler;