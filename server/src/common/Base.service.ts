import DataBase from "../DB/DataBase";

class BaseService {
    private readonly _db;

    constructor(database: DataBase) {
        this._db = database;
    }

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