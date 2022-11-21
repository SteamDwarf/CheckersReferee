import { Request, Response } from "express";

const notFoundHandler = (request: Request, response: Response) => {
    response.status(404).json("Not Found 404");
}

export default notFoundHandler;