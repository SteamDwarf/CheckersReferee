import {Request, Response } from "express";
import { getDBCollections, findDocumentById, findDocuments } from "../database/database";
import expressAsyncHandler from "express-async-handler";

export const getSportsCategories = expressAsyncHandler(async(request: Request, response: Response) => {
    const categories = await findDocuments(getDBCollections().sportsCategories);

    response.json(categories);
})

export const getSportCategoryById = expressAsyncHandler(async(request: Request, response: Response) => {
    const {id} = request.params;
    const category = await findDocumentById(getDBCollections().sportsCategories, id);

    //if(!category) throw new NotFoundError("По указанному id не найдена спортивная категория");

    response.json(category);
})