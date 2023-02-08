import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections, findDocument, findDocuments } from "../database/database";

export const getSportsCategories = (request: Request, response: Response, next: NextFunction) => {
    findDocuments(collections.sportsCategories)
        ?.then(categories => response.json(categories))
        .catch(error => next(error))
}

export const getSportCategoryById = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocument(collections.sportsCategories, {"_id": new ObjectId(id)})
        ?.then(category => response.send(category))
        .catch(error => next(error));
}