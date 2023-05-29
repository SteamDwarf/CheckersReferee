import { inject, injectable } from "inversify";
import { IMiddlewareAsync } from "../../common/interfaces";
import TournamentService from "../Tournament.service";
import { SERVICES } from "../../common/injectables.types";
import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../errors/NotFound.error";
import { TournamentSystems } from "../../models/tournaments.model";
import { InputError } from "../../errors/Input.error";

@injectable()
class TournamentFinishTourMiddleware implements IMiddlewareAsync {

    constructor(
        @inject(SERVICES.Tournament) private readonly _tournamentService: TournamentService
    ){}

    public async execute(request: Request, response:Response, next: NextFunction) {
        const {id} = request.params;
        const tournament = await this._tournamentService.getTournamentByID(id);

        if(!tournament) throw new NotFoundError("По указанному id турнир не найден");
        if(!tournament.isStarted) throw new NotFoundError("Данный турнир еще не стартовал");
        if(tournament.isFinished) throw new NotFoundError("Данный турнир уже завершился");
        if(tournament.tournamentSystem !== TournamentSystems.round && tournament.tournamentSystem !== TournamentSystems.swiss) {
            throw new InputError("Вы указали некорректную систему турнира. Выберите одну из предложенных: 'Круговая' или 'Швейцарская'");
        }

        next();
    }
}

export default TournamentFinishTourMiddleware;