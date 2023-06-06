import { inject, injectable } from "inversify";
import BaseRepository from "../common/Base.repository";
import { MAIN } from "../common/injectables.types";
import DataBase from "../DB/DataBase";
import { ISportsCategoryWithID } from "./sportsCategory.model";

@injectable()
class SportsCategoryRepository extends BaseRepository {
    constructor(
        @inject(MAIN.Database) database: DataBase
    ) {
        super(database);
    }

    public async getSportsCategories() {
        return await this.db.findDocuments(this.db.collections.sportsCategories) as ISportsCategoryWithID[]
    }

    public async getSportCategoryByID(id: string) {
        return await this.db.findDocumentById(this.db.collections.sportsCategories, id) as ISportsCategoryWithID | undefined;
    }
}

export default SportsCategoryRepository;