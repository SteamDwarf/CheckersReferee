import { NotFoundError } from "../errors/NotFound.error";
import BaseService from "../common/Base.service";
import DataBase from "../DB/DataBase";
import { inject, injectable } from "inversify";
import { MAIN, REPOSITORIES } from "../common/injectables.types";
import AuthRepository from "./Auth.repository";
import UserDocument from "./UserDocument.entity";
import UserAuthDTO from "./dtos/UserAuth.dto";

//TODO убрать у всех сервисов бд
@injectable()
class AuthService extends BaseService{
    constructor(
        @inject(MAIN.Database) db: DataBase,
        @inject(REPOSITORIES.Auth) private readonly _authRepository: AuthRepository
    ) {
        super(db);
    }

    public async auth(user: UserAuthDTO) {
        const userPlainDocument = await this.findUser(user.login);
        const userDocument = new UserDocument(userPlainDocument);

        await userDocument.comparePassword(user.password);

        return userDocument;
        /* const isPasswordCompare = await bcrypt.compare(password, user.password);
    
        if(!isPasswordCompare) throw new AuthError("Вы ввели неверный пароль");

        const {password: _, ...userData} = user;

        return userData; */
    }

    private async findUser (login: string) {
        const user = await this._authRepository.getUser(login);

        if(!user) throw new NotFoundError("Пользователь с данным логином не найден");
    
        return user;
    }
    
}

export default AuthService;