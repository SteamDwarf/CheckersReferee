import { Request, Response } from "express";

const notFoundHandler = (request: Request, response: Response) => {
    response.status(404).json({
        status: 404,
        message: "Ресурс не найден 404"
    });
}

export default notFoundHandler;