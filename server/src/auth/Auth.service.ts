import { NotFoundError } from "../errors/NotFound.error";
import BaseService from "../common/Base.service";
import { inject, injectable } from "inversify";
import { MAIN, REPOSITORIES, SERVICES } from "../common/injectables.types";
import AuthRepository from "./Auth.repository";
import UserDocument from "./UserDocument.entity";
import UserAuthDTO from "./dtos/UserAuth.dto";
import JWTService from "../jwt/JWT.service";

@injectable()
class AuthService extends BaseService{
    constructor(
        @inject(REPOSITORIES.Auth) private readonly _authRepository: AuthRepository,
        @inject(SERVICES.JWT) private readonly _jwtService: JWTService,
        @inject(MAIN.AccessSecret) private readonly _secret: string
    ) {
        super();
    }

    public async auth(user: UserAuthDTO) {
        const userPlainDocument = await this.findUser(user.login);
        const userDocument = new UserDocument(userPlainDocument);

        await userDocument.comparePassword(user.password);

        const jwt = await this._jwtService.sign(userDocument.login, this._secret);

        userDocument.token = jwt;

        return userDocument;
    }

    private async findUser (login: string) {
        const user = await this._authRepository.getUser(login);

        if(!user) throw new NotFoundError("Пользователь с данным логином не найден");
    
        return user;
    }
    
}

export default AuthService;