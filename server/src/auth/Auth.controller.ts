import { Request, Response } from "express";
import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import AuthMiddleware from "./Auth.middleware";
import AuthService from "./Auth.service";
import { inject, injectable } from "inversify";
import { MIDDLEWARES, SERVICES } from "../common/injectables.types";

@injectable()
class AuthController extends BaseController{
    constructor(
        @inject(MIDDLEWARES.Auth) private readonly authMiddleware: AuthMiddleware, 
        @inject(SERVICES.Auth) private readonly _authService: AuthService
    ) {
        super();
        this.initRoutes(
            [new ControllerRoute('/', 'post', [authMiddleware.checkEmptyData], this.asyncHandler(this.auth))]
        )
    }

    private async auth (request: Request, response: Response){
        const {login, password} = request.body;
        const compareResult = await this._authService.comparePassword(login, password);

        response.json(compareResult);
    }
}

export default AuthController;

/* export const handleAuth = expressAsyncHandler(async(request: Request, response: Response) => {
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
 */


