import { NextFunction, Request, Response } from "express";
import { getDBCollections, findDocument } from "../database/database";
import validator from "validator";
import bcrypt from "bcrypt";

export const handleAuth = (request: Request, response: Response, next: NextFunction) => {
    const {login, password} = request.body;
    const isEmptyData = Object.keys(request.body).length === 0
                        || validator.isEmpty(login) 
                        || validator.isEmpty(password, {ignore_whitespace: true});
    let findedUser: any = null;

    if(isEmptyData) {
        response.status(400)
        throw new Error("Необходимо ввести логин и пароль");
    }

    findDocument(getDBCollections().users, {login: login})
    ?.then(user => {
        if(!user) {
            response.status(400);
            throw new Error("Пользователь с данным логином не найден");
        }

        findedUser = user;
        return bcrypt.compare(password, findedUser.password)
    })
    .then(isPasswordCorrect => {
        if(isPasswordCorrect) {
            const {password: _, ...userData} = findedUser;
            return response.json(userData);
        }

        response.status(400);
        throw new Error("Вы ввели неверный пароль");
    })
    .catch(error => {
        next(error);
    });
}
