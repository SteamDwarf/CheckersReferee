import validator from "validator";
import { InputError } from "../utils/ServerError";
import { NextFunction, Request, Response } from "express";

class AuthMiddleware {
    public checkEmptyData(request: Request, response: Response, next: NextFunction) {
        const {login, password} = request.body;
        const isEmptyData = !login || !password
                            ||validator.isEmpty(login, {ignore_whitespace: true}) 
                            || validator.isEmpty(password, {ignore_whitespace: true});
                            
        if(isEmptyData) throw new InputError("Необходимо ввести логин и пароль");

        next();
    }
}

export default AuthMiddleware;