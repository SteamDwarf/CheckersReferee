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
                )
            ]
        )
    }

    private async auth (request: Request, response: Response){
        const userDocument = await this._authService.auth(request.body);

        response.json(userDocument.data);
    }
}

export default AuthController;


