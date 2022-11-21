import { NextFunction, Request, Response } from "express";

//TODO переделать 
const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
    const responseStatus = response.statusCode || 500

    console.error(error.message);
    response.status(responseStatus).json({status: responseStatus, message: error.message});
}

export default errorHandler;