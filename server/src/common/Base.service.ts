import { inject, injectable} from "inversify";
import DataBase from "../DB/DataBase";
import { MAIN } from "./injectables.types";

@injectable()
class BaseService {
    constructor(@inject(MAIN.Database) private readonly _db: DataBase) {}

    protected get db() {
        return this._db;
    }

    
    protected paginateData <T>(dataArray: T[], limit: number, page: number){
        const startInd = (page - 1) * limit;
        const endInd = limit * page;
        return dataArray.slice(startInd, endInd)
    }
}

export default BaseService;