import { Request, Response } from "express";
import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import AuthService from "./Auth.service";
import { inject, injectable } from "inversify";
import { SERVICES } from "../common/injectables.types";
import ValidateMiddleware from "../common/Validate.middleware";
import UserAuthDTO from "./dtos/UserAuth.dto";

@injectable()
class AuthController extends BaseController{

    constructor(
        @inject(SERVICES.Auth) private readonly _authService: AuthService
    ) {
        super();

        this.initRoutes(
            [
                new ControllerRoute('/', 'post', 
                    [new ValidateMiddleware(UserAuthDTO)], 
                    this.auth
                ),
                new ControllerRoute('/refresh', 'get',
                    [],
                    this.refresh
                )
            ]
        )
    }

    private async auth (request: Request, response: Response){
        const {login, accessToken, refreshToken} = await this._authService.auth(request.body);

        response.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        response.json({login, accessToken});
    }

    private async refresh(request: Request, response: Response) {
        const cookies = request.cookies;
        const accessToken = await this._authService.refresh(cookies);

        response.json({accessToken});
    }
}

export default AuthController;


