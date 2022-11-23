import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { findDocument, findDocuments } from "../database/database";
import { CollectionNames } from "../database/enums";

export const getSportsCategories = (request: Request, response: Response, next: NextFunction) => {
    findDocuments(CollectionNames.SPORTS_CATEGORIES)
        ?.then(categories => response.json(categories))
        .catch(error => next(error))
}

export const getSportCategoryById = (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;

    findDocument(CollectionNames.SPORTS_CATEGORIES, {"_id": new ObjectId(id)})
        ?.then(category => response.send(category))
        .catch(error => next(error));
}