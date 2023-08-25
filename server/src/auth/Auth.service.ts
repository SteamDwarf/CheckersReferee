import { NotFoundError } from "../errors/NotFound.error";
import BaseService from "../common/Base.service";
import { inject, injectable } from "inversify";
import { MAIN, REPOSITORIES, SERVICES } from "../common/injectables.types";
import AuthRepository from "./Auth.repository";
import UserDocument from "./UserDocument.entity";
import UserAuthDTO from "./dtos/UserAuth.dto";
import JWTService from "../jwt/JWT.service";
import { AuthError } from "../errors/Auth.error";
import { ForbiddenError } from "../errors/Forbidden.error";

@injectable()
class AuthService extends BaseService{
    constructor(
        @inject(REPOSITORIES.Auth) private readonly _authRepository: AuthRepository,
        @inject(SERVICES.JWT) private readonly _jwtService: JWTService,
        @inject(MAIN.AccessSecret) private readonly _accessSecret: string,
        @inject(MAIN.RefreshSecret) private readonly _refreshSecret: string,
        @inject(MAIN.RefreshTokenLife) private readonly _refreshTokenLife: string,
        @inject(MAIN.AccessTokenLife) private readonly _accessTokenLife: string,
    ) {
        super();
    }

    public async auth(user: UserAuthDTO) {
        const userDocument = await this.findUser(user.login);

        await userDocument.comparePassword(user.password);

        console.log(this._accessTokenLife);
        const accessToken = await this._jwtService.sign(
            userDocument.login, 
            this._accessSecret, 
            this._accessTokenLife
        );
        const refreshToken = await this._jwtService.sign(
            userDocument.login, 
            this._refreshSecret, 
            this._refreshTokenLife
        );

        userDocument.refreshToken = refreshToken;
        await this._authRepository.updateUser(userDocument);

        return {login: userDocument.login, refreshToken, accessToken};
    }

    public async refresh(cookies: {jwt?: string}) {
        if(!cookies.jwt) throw new AuthError("Вы не авторизованы.");

        const refreshToken = cookies.jwt;
        const user = await this._authRepository.getUser({refreshToken});
        console.log(user);
        if(!user) throw new ForbiddenError("Недостаточно прав доступа");

        const payload = await this._jwtService.verify(refreshToken, this._refreshSecret);

        if(payload.login !== user.login) throw new ForbiddenError("Недостаточно прав доступа");

        const accessToken = await this._jwtService.sign(
            user.login, 
            this._accessSecret, 
            this._accessTokenLife
        );

        return accessToken;
    }

    private async findUser (login: string) {
        const user = await this._authRepository.getUser({login});

        if(!user) throw new NotFoundError("Пользователь с данным логином не найден");
    
        return user;
    }
    
}

export default AuthService;