import { NextFunction, Request, Response } from "express";
import { IMiddlewareAsync } from "../../common/interfaces";
import PlayerService from "../Players.service";
import { NotFoundError } from "../../errors/NotFound.error";

//TODO наследуемся от BaseMiddlewareAsync
class PlayerExistMiddleware implements IMiddlewareAsync{
    private readonly _playerService: PlayerService;

    constructor(playerService: PlayerService) {
        this._playerService = playerService;
    }

    public async execute(request: Request, response: Response, next: NextFunction) {
        //TODO разобраться как убрать try catch
        try {
            const {id} = request.params;
            const player = await this._playerService.getPlayerByID(id);
        
            if(!player) return next(new NotFoundError("По указанному id игрок не найден"));

            next();
        }catch(error) {
            next(error);
        }
        
    }
}

export default PlayerExistMiddleware;