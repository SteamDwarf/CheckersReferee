import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { findDocument, findDocuments } from "../database/database";

export const getSportsCategories = (request: Request, response: Response, next: NextFunction) => {
    findDocuments("sportsCategories")
        ?.then(categories => response.json(categories))
        .catch(error => next(error))
}

export const getSportCategoryById = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocument("sportsCategories", {"_id": new ObjectId(id)})
        ?.then(category => response.send(category))
        .catch(error => next(error));
}