import { ObjectId } from "mongodb";
import { IUserWithID, UserRoles } from "./users.model";
import bcrypt from "bcrypt";
import { AuthError } from "../errors/Auth.error";


class UserDocument {
    private readonly _id: string;
    private _login: string;
    private readonly _password: string;
    private  _refreshToken: string;
    private readonly _role?: UserRoles;

    constructor(userData: IUserWithID) {
        this._id = userData._id.toString();
        this._login = userData.login;
        this._password = userData.password;
        this._refreshToken = userData.refreshToken || "";
        this._role = userData.role || UserRoles.GUEST;
    }

    public get id() {
        return this._id;
    }

    public get data() {
        return {
            _id: this._id,
            login: this._login,
            role: this._role,
            refreshToken: this._refreshToken
        }
    }

    public get login(): string {
        return this._login;
    }

    public get refreshToken(): string {
        return this._refreshToken;
    }

    public set refreshToken (t: string) {
        this._refreshToken = t;
    }

    public async comparePassword(password: string) {
        const isPasswordCompare = await bcrypt.compare(password, this._password);
    
        if(!isPasswordCompare) throw new AuthError("Вы ввели неверный пароль");
    }
}

export default UserDocument;