import { ObjectId } from "mongodb";
import { IUserWithID, UserRoles } from "./users.model";
import bcrypt from "bcrypt";
import { AuthError } from "../errors/Auth.error";


class UserDocument {
    private readonly _id: ObjectId;
    private readonly _login: string;
    private readonly _password: string;
    private readonly _role?: UserRoles;

    constructor(userData: IUserWithID) {
        this._id = userData._id;
        this._login = userData.login;
        this._password = userData.password;
        this._role = userData.role || UserRoles.GUEST;
    }

    public get data() {
        return {
            _id: this._id,
            login: this._login,
            role: this._role
        }
    }

    public async comparePassword(password: string) {
        const isPasswordCompare = await bcrypt.compare(password, this._password);
    
        if(!isPasswordCompare) throw new AuthError("Вы ввели неверный пароль");
    }
}

export default UserDocument;