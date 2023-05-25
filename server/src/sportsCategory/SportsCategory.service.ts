import { findDocuments, getDBCollections, findDocumentById } from "../database/database";
import { ISportsCategoryWithID } from "../models/sportsCategory.model";

class SportsCategoryService {
    public async findSportCategories() {
        return await findDocuments(getDBCollections().sportsCategories) as ISportsCategoryWithID[];
    }

    public async findSportsCategoryByID(id: string) {
        return await findDocumentById(getDBCollections().sportsCategories, id) as ISportsCategoryWithID;
    }
}

export default SportsCategoryService;