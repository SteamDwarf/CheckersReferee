import { Request, Response } from "express";
import { getDBCollections, findDocument } from "../database/database";
import expressAsyncHandler from "express-async-handler";
import validator from "validator";
import bcrypt from "bcrypt";
import { IUser } from "../models/users.model";
import { AuthError, InputError, NotFoundError} from "../utils/ServerError";

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
                        
    if(isEmptyData) throw new InputError("Необходимо ввести логин и пароль");
}

async function findUser (login: string) {
    const user = await findDocument(getDBCollections().users, {login});

    if(!user) throw new NotFoundError("Пользователь с данным логином не найден");

    return user;
}

async function comparePassword(password: string, user: IUser) {
    const isPasswordCompare = await bcrypt.compare(password, user.password);

    if(!isPasswordCompare) throw new AuthError("Вы ввели неверный пароль");
}

function sendUserData(user: IUser, response: Response) {
    const {password: _, ...userData} = user;

    response.json(userData);
}



