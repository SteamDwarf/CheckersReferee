import { inject, injectable } from "inversify";
import BaseService from "../common/Base.service";
import { REPOSITORIES } from "../common/injectables.types";
import SportsCategoryRepository from "./SportsCategory.repository";
import SportsCategoryDocument from "./SportsCategoryDocument.entity";
import { SportCategoriesAbbr } from "../common/enums";

@injectable()
class SportsCategoryService extends BaseService {
    constructor(
        @inject(REPOSITORIES.SportsCategory) private readonly _sportsCategoryRepository: SportsCategoryRepository
    ) 
    {
        super();
    }

    public async getSportCategories() {
        /* if(this._sportCategories) {
            return this._sportCategories;
        }

        const categoriesPlainDocuments = await this._sportsCategoryRepository.getSportsCategories();
        const categoriesDocuments = categoriesPlainDocuments.map(category => new SportsCategoryDocument(category));

        this._sportCategories = categoriesDocuments;

        return categoriesDocuments; */
        return await this._sportsCategoryRepository.getSportCategories();
    }

    public async getSportCategoryByID(id: string): Promise<SportsCategoryDocument | undefined> {
        return await this._sportsCategoryRepository.getSportCategoryByID(id);
        /* if(this._sportCategories) {
            const categoryPlainDocument = this._sportCategories.find(category => category.id === id);
            return categoryPlainDocument;
        }
        
        await this.getSportCategories();
        return await this.getSportCategoryByID(id); */
    }

    public async getPrevCategory(currentCategoryIndex: number) {
        const sportCategories = await this._sportsCategoryRepository.getSportCategories();

        return sportCategories.find(category => category.index === currentCategoryIndex - 1);

    }

    public async getNearestCategory(tournamentCoefficient: number) {
        const roundedCoefficient = Math.ceil(tournamentCoefficient);
        let categories: SportsCategoryDocument[] | undefined = [];

        if(roundedCoefficient <= 1) {
            categories = await this._sportsCategoryRepository.getSportCategoriesWithFilter({
                shortTitle: SportCategoriesAbbr.CMS
            });
        }
        else if(roundedCoefficient >= 6) {
            categories = await this._sportsCategoryRepository.getSportCategoriesWithFilter({
                shortTitle: SportCategoriesAbbr.IIIy
            })
        }
        else {
            categories = await this._sportsCategoryRepository.getSportCategoriesWithFilter({
                requiredTournamentCoefficient: roundedCoefficient
            });
        }

        return categories ? categories[0] : undefined;
        
    }

    public async getSportsCategoryScore(
        playerSportsCategory: SportsCategoryDocument, 
        competitorSportsCategoryID: string
    ) {
        const competitorSportsCategory = await this.getSportCategoryByID(competitorSportsCategoryID);

        if(playerSportsCategory && competitorSportsCategory) {
            if(playerSportsCategory.shortTitle === SportCategoriesAbbr.IIy && 
                competitorSportsCategory.shortTitle === SportCategoriesAbbr.UD
            ) {
                return 0.75;
            }

            if(playerSportsCategory.index > 6 || competitorSportsCategory.index > 6) return 0;

            const indexDiff = playerSportsCategory.index - competitorSportsCategory.index;

            if(indexDiff === 0) return 0.50;
            else if(indexDiff > -4 && indexDiff < 4) {
                const incerement = indexDiff * 0.15;
                return 0.50 + incerement;
            }

        }

        return 0;
    }
 }

export default SportsCategoryService;