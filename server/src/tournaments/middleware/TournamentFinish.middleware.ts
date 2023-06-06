import { inject, injectable } from "inversify";
import { IMiddlewareAsync } from "../../common/interfaces";
import TournamentService from "../Tournament.service";
import { SERVICES } from "../../common/injectables.types";
import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../errors/NotFound.error";
import { InputError } from "../../errors/Input.error";
import { TournamentSystems } from "../tournaments.model";

@injectable()
class TournamentFinishMiddleware implements IMiddlewareAsync {

    constructor(
        @inject(SERVICES.Tournament) private readonly _tournamentService: TournamentService
    ){}

    public async execute(request: Request, response:Response, next: NextFunction) {
        const {id} = request.params;
        const tournament = await this._tournamentService.getTournamentByID(id);

        //TODO в асинхронных middleware пока решается проблема так
        try {
            if(!tournament) return next(new NotFoundError("По указанному id турнир не найден"));
            if(tournament.isFinished) return next(new InputError("Данный турнир уже завершен"));
            if(tournament.tournamentSystem !== TournamentSystems.round && tournament.tournamentSystem !== TournamentSystems.swiss) {
                return next(new InputError("Вы указали некорректную систему турнира. Выберите одну из предложенных: 'Круговая' или 'Швейцарская'"));
            }

            next();

        }catch(error) {
            next(error);
        }
        

    }
}

export default TournamentFinishMiddleware;