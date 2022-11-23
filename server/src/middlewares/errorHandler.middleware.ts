import { DiffieHellmanGroup } from "crypto";
import { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";

interface ResponseError {
    status: number,
    message: string,
    details?: any
}


const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
    let sendedError:ResponseError = {
        status: 500,
        message: "",
    }

    if(error.message === "Document failed validation") {
        sendedError.status = 400;
        sendedError.message = "Документ не прошел проверку. Некорректный тип данных";
        sendedError.details = error;
    } else {
        sendedError.status = response.statusCode !== 200 ? response.statusCode : 500;
        sendedError.message = sendedError.status === 500 ? "Внутрення ошибка сервера" : error.message;
    }

    console.error(error);
    response.status(sendedError.status).json(sendedError);
}

export default errorHandler;