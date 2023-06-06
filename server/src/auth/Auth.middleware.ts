import validator from "validator";
import { NextFunction, Request, Response } from "express";
import { InputError } from "../errors/Input.error";
import { injectable } from "inversify";

@injectable()
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