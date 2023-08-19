import { ObjectId } from "mongodb";
import { IUserWithID, UserRoles } from "./users.model";
import bcrypt from "bcrypt";
import { AuthError } from "../errors/Auth.error";


class UserDocument {
    private readonly _id: ObjectId;
    private _login: string;
    private readonly _password: string;
    private  _token: string;
    private readonly _role?: UserRoles;

    constructor(userData: IUserWithID) {
        this._id = userData._id;
        this._login = userData.login;
        this._password = userData.password;
        this._token = userData.token || "";
        this._role = userData.role || UserRoles.GUEST;
    }

    public get data() {
        return {
            _id: this._id,
            login: this._login,
            role: this._role,
            token: this._token
        }
    }

    public get login(): string {
        return this._login;
    }

    public get token(): string {
        return this._token;
    }

    public set token (t: string) {
        this._token = t;
    }

    public async comparePassword(password: string) {
        const isPasswordCompare = await bcrypt.compare(password, this._password);
    
        if(!isPasswordCompare) throw new AuthError("Вы ввели неверный пароль");
    }
}

export default UserDocument;