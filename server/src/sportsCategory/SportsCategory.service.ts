import { inject, injectable } from "inversify";
import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import { ISportsCategoryWithID } from "./sportsCategory.model";
import { MAIN, REPOSITORIES } from "../common/injectables.types";
import SportsCategoryRepository from "./SportsCategory.repository";
import SportsCategoryDocument from "./SportsCategoryDocument.entity";

@injectable()
class SportsCategoryService extends BaseService {
    constructor(
        @inject(MAIN.Database) db: DataBase,
        @inject(REPOSITORIES.SportsCategory) private readonly _sportsCategoryRepository: SportsCategoryRepository
    ) 
    {
        super(db);
    }

    public async getSportCategories() {
        const categoriesPlainDocuments = await this._sportsCategoryRepository.getSportsCategories();
        const categoriesDocuments = categoriesPlainDocuments.map(category => new SportsCategoryDocument(category));

        return categoriesDocuments;
        //return await this.db.findDocuments(this.db.collections.sportsCategories) as ISportsCategoryWithID[];
    }

    public async getSportsCategoryByID(id: string) {
        const categoryPlainDocument = await this._sportsCategoryRepository.getSportCategoryByID(id);

        if(categoryPlainDocument) {
            const categoryDocument = new SportsCategoryDocument(categoryPlainDocument);
            return categoryDocument;
        }

        return null;
        //return await this.db.findDocumentById(this.db.collections.sportsCategories, id) as ISportsCategoryWithID;
    }
}

export default SportsCategoryService;