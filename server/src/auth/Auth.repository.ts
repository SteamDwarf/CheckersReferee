import { inject, injectable } from "inversify";
import BaseRepository from "../common/Base.repository";
import { MAIN, REPOSITORIES } from "../common/injectables.types";
import DataBase from "../DB/DataBase";
import { IUserWithID } from "./users.model";
import UserDocument from "./UserDocument.entity";

@injectable()
class AuthRepository extends BaseRepository{
    constructor(
        @inject(MAIN.Database) database: DataBase
    ) {
        super(database);
    }

    public async getUser(filter: object) {
        const userPlain = await this.db.findDocument(this.db.collections.users, filter) as IUserWithID | undefined;
        
        if(userPlain) return new UserDocument(userPlain);
    }

    public async updateUser(user: UserDocument) {
        const {_id, ...userData} = user.data;
        const updatedUser = await this.db.updateDocument(
            this.db.collections.users, 
            _id, 
            userData
        )as IUserWithID | undefined;
        
        if(updatedUser) return new UserDocument(updatedUser);
    }
}

export default AuthRepository;