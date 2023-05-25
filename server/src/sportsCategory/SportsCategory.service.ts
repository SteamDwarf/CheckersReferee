import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import { ISportsCategoryWithID } from "../models/sportsCategory.model";

class SportsCategoryService extends BaseService {
    constructor(db: DataBase) {
        super(db);
    }

    public async findSportCategories() {
        return await this.db.findDocuments(this.db.collections.sportsCategories) as ISportsCategoryWithID[];
    }

    public async findSportsCategoryByID(id: string) {
        return await this.db.findDocumentById(this.db.collections.sportsCategories, id) as ISportsCategoryWithID;
    }
}

export default SportsCategoryService;