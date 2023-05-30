import validator from "validator";
import { IMiddleware } from "../../common/interfaces";
import { Request, Response, NextFunction } from "express";
import { InputError } from "../../errors/Input.error";
import { injectable } from "inversify";

@injectable()
class AuthCheckEmptyMiddleware implements IMiddleware{
    public execute(request: Request, response: Response, next: NextFunction) {
        const {login, password} = request.body;
        const isEmptyData = !login || !password
                            ||validator.isEmpty(login, {ignore_whitespace: true}) 
                            || validator.isEmpty(password, {ignore_whitespace: true});
                            
        if(isEmptyData) return next(new InputError("Необходимо ввести логин и пароль"));

        next();
    }
}   

export default AuthCheckEmptyMiddleware;