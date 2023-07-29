import { inject, injectable } from "inversify";
import BaseRepository from "../common/Base.repository";
import { MAIN } from "../common/injectables.types";
import DataBase from "../DB/DataBase";
import { ISportsCategory, ISportsCategoryWithID } from "./sportsCategory.model";
import SportsCategoryDocument from "./SportsCategoryDocument.entity";

@injectable()
class SportsCategoryRepository extends BaseRepository {
    private _sportCategories: SportsCategoryDocument[];


    constructor(
        @inject(MAIN.Database) database: DataBase
    ) {
        super(database);
    }

    public async getSportCategories() {
        if(this._sportCategories) {
            return this._sportCategories;
        }

        const categoriesPlainDocuments = await this.db.findDocuments(this.db.collections.sportsCategories) as ISportsCategoryWithID[];
        const categoriesDocuments = categoriesPlainDocuments.map(category => new SportsCategoryDocument(category));

        this._sportCategories = categoriesDocuments;

        return categoriesDocuments;
    }

    public async getSportCategoryByID(id: string): Promise<SportsCategoryDocument | undefined> {
        if(this._sportCategories) {
            const categoryPlainDocument = this._sportCategories.find(category => category.id === id);
            return categoryPlainDocument;
        }
        
        await this.getSportCategories();
        return await this.getSportCategoryByID(id);
    }

    public async getSportCategoriesWithFilter(filter: Partial<ISportsCategory>) {
        const sportCategoriesPlain = await this.db.findDocumentsWithFilter(this.db.collections.sportsCategories, filter) as ISportsCategoryWithID[] | undefined;

        return sportCategoriesPlain?.map(category => new SportsCategoryDocument(category));
    }
}

export default SportsCategoryRepository;