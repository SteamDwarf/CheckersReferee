import { inject, injectable } from "inversify";
import BaseService from "../common/Base.service";
import { REPOSITORIES } from "../common/injectables.types";
import SportsCategoryRepository from "./SportsCategory.repository";
import SportsCategoryDocument from "./SportsCategoryDocument.entity";

@injectable()
class SportsCategoryService extends BaseService {
    constructor(
        @inject(REPOSITORIES.SportsCategory) private readonly _sportsCategoryRepository: SportsCategoryRepository
    ) 
    {
        super();
    }

    public async getSportCategories() {
        const categoriesPlainDocuments = await this._sportsCategoryRepository.getSportsCategories();
        const categoriesDocuments = categoriesPlainDocuments.map(category => new SportsCategoryDocument(category));

        return categoriesDocuments;
    }

    public async getSportsCategoryByID(id: string) {
        const categoryPlainDocument = await this._sportsCategoryRepository.getSportCategoryByID(id);

        if(categoryPlainDocument) {
            const categoryDocument = new SportsCategoryDocument(categoryPlainDocument);
            return categoryDocument;
        }

        return null;
    }
}

export default SportsCategoryService;