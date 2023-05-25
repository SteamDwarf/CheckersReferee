import bcrypt from "bcrypt";
import { findDocument, getDBCollections } from "../database/database";
import { AuthError, NotFoundError } from "../utils/ServerError";
import { IUser } from "./users.model";

//TODO в конструктор передавать бд
class AuthService {
    public async comparePassword(login: string, password: string) {
        const user = await this.findUser(login);
        const isPasswordCompare = await bcrypt.compare(password, user.password);
    
        if(!isPasswordCompare) throw new AuthError("Вы ввели неверный пароль");

        const {password: _, ...userData} = user;

        return userData;
    }

    private async findUser (login: string) {
        const user = await findDocument(getDBCollections().users, {login});
    
        if(!user) throw new NotFoundError("Пользователь с данным логином не найден");
    
        return user as IUser;
    }
    
}

export default AuthService;