import DataBase from "../DB/DataBase";

class BaseService {
    private readonly _db;

    constructor(database: DataBase) {
        this._db = database;
    }

    protected get db() {
        return this._db;
    }
}

export default BaseService;