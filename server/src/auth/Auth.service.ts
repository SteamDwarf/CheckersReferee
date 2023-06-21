import { NotFoundError } from "../errors/NotFound.error";
import BaseService from "../common/Base.service";
import { inject, injectable } from "inversify";
import { REPOSITORIES } from "../common/injectables.types";
import AuthRepository from "./Auth.repository";
import UserDocument from "./UserDocument.entity";
import UserAuthDTO from "./dtos/UserAuth.dto";

@injectable()
class AuthService extends BaseService{
    constructor(
        @inject(REPOSITORIES.Auth) private readonly _authRepository: AuthRepository
    ) {
        super();
    }

    public async auth(user: UserAuthDTO) {
        const userPlainDocument = await this.findUser(user.login);
        const userDocument = new UserDocument(userPlainDocument);

        await userDocument.comparePassword(user.password);

        return userDocument;
    }

    private async findUser (login: string) {
        const user = await this._authRepository.getUser(login);

        if(!user) throw new NotFoundError("Пользователь с данным логином не найден");
    
        return user;
    }
    
}

export default AuthService;