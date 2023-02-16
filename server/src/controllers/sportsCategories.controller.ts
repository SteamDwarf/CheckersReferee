import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDBCollections, findDocumentById, findDocuments } from "../database/database";

export const getSportsCategories = (request: Request, response: Response, next: NextFunction) => {
    findDocuments(getDBCollections().sportsCategories)
        ?.then(categories => response.json(categories))
        .catch(error => next(error))
}

export const getSportCategoryById = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocumentById(getDBCollections().sportsCategories, id)
        ?.then(category => response.send(category))
        .catch(error => next(error));
}