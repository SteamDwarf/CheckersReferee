import { inject, injectable } from "inversify";
import BaseRepository from "../common/Base.repository";
import { MAIN, REPOSITORIES } from "../common/injectables.types";
import DataBase from "../DB/DataBase";
import { IUserWithID } from "./users.model";

@injectable()
class AuthRepository extends BaseRepository{
    constructor(
        @inject(MAIN.Database) database: DataBase
    ) {
        super(database);
    }

    public async getUser(login: string) {
        return await this.db.findDocument(this.db.collections.users, {login}) as IUserWithID | undefined;
    }
}

export default AuthRepository;