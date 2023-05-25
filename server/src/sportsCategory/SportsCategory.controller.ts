import BaseController from "../common/Base.controller";
import { Request, Response } from "express";
import SportsCategoryService from "./SportsCategory.service";
import ControllerRoute from "../common/ControllerRouter";

class SportsCategoryController extends BaseController {
    private readonly _sportsCategoryService;

    constructor(sportCategoryService: SportsCategoryService) {
        super();
        this._sportsCategoryService = sportCategoryService;
        this.initRoutes([
            new ControllerRoute('/', 'get', [], this.asyncHandler(this.get)),
            new ControllerRoute('/:id', 'get', [], this.asyncHandler(this.getById))
        ])
    }

    public async get (request: Request, response: Response){
        const categories = await this._sportsCategoryService.findSportCategories();
    
        response.json(categories);
    }
    
    public async getById (request: Request, response: Response) {
        const {id} = request.params;
        const category = await this._sportsCategoryService.findSportsCategoryByID(id);
    
        response.json(category);
    }
}

export default SportsCategoryController;