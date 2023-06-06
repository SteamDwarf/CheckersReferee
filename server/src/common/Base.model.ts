import { inject, injectable } from "inversify";
import { MAIN } from "./injectables.types";
import DataBase from "../DB/DataBase";

@injectable()
class BaseModel {
    constructor(
        @inject(MAIN.Database) private readonly _db: DataBase
    ){}

    get db() {
        return this._db;
    }
}

export default BaseModel;