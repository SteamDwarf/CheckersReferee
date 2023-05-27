import { inject, injectable } from "inversify";
import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import { ISportsCategoryWithID } from "../models/sportsCategory.model";
import { MAIN } from "../common/injectables.types";

@injectable()
class SportsCategoryService extends BaseService {
    constructor(@inject(MAIN.Database) db: DataBase) {
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