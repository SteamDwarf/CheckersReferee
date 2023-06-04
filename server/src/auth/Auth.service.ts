import bcrypt from "bcrypt";
import { IUser } from "./users.model";
import { AuthError } from "../errors/Auth.error";
import { NotFoundError } from "../errors/NotFound.error";
import BaseService from "../common/Base.service";
import DataBase from "../DB/DataBase";
import { inject, injectable } from "inversify";
import { MAIN } from "../common/injectables.types";

//TODO убрать у всех сервисов бд
@injectable()
class AuthService extends BaseService{
    constructor(@inject(MAIN.Database) db: DataBase) {
        super(db);
    }

    public async comparePassword(login: string, password: string) {
        const user = await this.findUser(login);
        const isPasswordCompare = await bcrypt.compare(password, user.password);
    
        if(!isPasswordCompare) throw new AuthError("Вы ввели неверный пароль");

        const {password: _, ...userData} = user;

        return userData;
    }

    private async findUser (login: string) {
        const user = await this.db.findDocument(this.db.collections.users, {login});
    
        if(!user) throw new NotFoundError("Пользователь с данным логином не найден");
    
        return user as IUser;
    }
    
}

export default AuthService;