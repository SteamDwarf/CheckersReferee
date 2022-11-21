import { NextFunction, Request, Response } from "express";
import { findDocument } from "../database/database";
import validator from "validator";
import bcrypt from "bcrypt";

export const handleAuth = (request: Request, response: Response, next: NextFunction) => {
    const authData = request.body;
    const isEmptyData = validator.isEmpty(authData.login) 
                        || validator.isEmpty(authData.password, {ignore_whitespace: true});
    let findedUser: any = null;

    if(isEmptyData) {
        return response.status(400).json({
            status: 400,
            message: "Необходимо ввести логин и пароль"
        });
    }

    findDocument('users', {login: authData.login})
    ?.then(user => {
        if(!user) {
            response.status(400);
            throw new Error("Пользователь с данным логином не найден");
        }

        findedUser = user;
        return bcrypt.compare(authData.password, findedUser.password)

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
