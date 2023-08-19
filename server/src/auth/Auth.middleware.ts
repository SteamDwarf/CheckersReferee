import { NextFunction, Request, Response } from "express";
import { IMiddlewareAsync } from "../common/interfaces";
import JWTService from "../jwt/JWT.service";
import { AuthError } from "../errors/Auth.error";
import { inject, injectable } from "inversify";
import { MAIN, MIDDLEWARES, SERVICES } from "../common/injectables.types";

@injectable()
class AuthMiddleware implements IMiddlewareAsync {
    constructor(
        @inject(SERVICES.JWT) private readonly _jwtService: JWTService, 
        @inject(MAIN.AccessSecret) private readonly _secret: string
    ) {
    }

    public async execute(request: Request, response: Response, next: NextFunction) {
        const token = request.headers.authorization?.split(" ")[1];
        
        try {
            if(token) {
                await this._jwtService.verify(token, this._secret);
                next();
            }
            else throw new AuthError("Недостаточно прав доступа. Необходима авторизация.")
        } catch(error) {
            next(error);
        }
        
    }
}

export default AuthMiddleware;