import { Request, Response } from "express";
import { getDBCollections, findDocument } from "../database/database";
import expressAsyncHandler from "express-async-handler";
import validator from "validator";
import bcrypt from "bcrypt";
import { IUser } from "../models/users.model";
import { ServerError } from "../utils/ServerError";

export const handleAuth = expressAsyncHandler(async(request: Request, response: Response) => {
    const {login, password} = request.body;

    checkEmptyData(login, password);
                        
    const user = await findUser(login) as IUser;
    await comparePassword(password, user);

    sendUserData(user, response);
});


function checkEmptyData(login: string | undefined, password: string | undefined) {
    const isEmptyData = !login || !password
                        ||validator.isEmpty(login, {ignore_whitespace: true}) 
                        || validator.isEmpty(password, {ignore_whitespace: true});
                        
    if(isEmptyData) throw new ServerError("Ошибка авторизации", "Необходимо ввести логин и пароль", 400);
}

async function findUser (login: string) {
    const user = await findDocument(getDBCollections().users, {login});

    if(!user) throw new ServerError("Ошибка авторизации", "Пользователь с данным логином не найден", 400);

    return user;
}

async function comparePassword(password: string, user: IUser) {
    const isPasswordCompare = await bcrypt.compare(password, user.password);

    if(!isPasswordCompare) throw new ServerError("Ошибка авторизации", "Вы ввели неверный пароль", 400);
}

function sendUserData(user: IUser, response: Response) {
    const {password: _, ...userData} = user;

    response.json(userData);
}



