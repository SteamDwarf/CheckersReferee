import { NextFunction, Response, Request } from "express";
import { IMiddlewareAsync } from "../../common/interfaces";
import GamesService from "../Games.service";
import { NotFoundError } from "../../errors/NotFound.error";


//TODO наверное удалить
class GameExistMiddleware implements IMiddlewareAsync{
    private readonly _gamesService: GamesService;

    constructor(gamesService: GamesService) {
        this._gamesService = gamesService;
    }

    public async execute(request: Request, response: Response, next: NextFunction) {
        //TODO разобраться как убрать try catch
        try {
            const {id} = request.params;
            const game = await this._gamesService.getGameByID(id);

            if(!game) return next(new NotFoundError("По указанному id игра не найдена"));

            next();
        }catch(error) {
            next(error);
        }
        
    }
}

export default GameExistMiddleware;