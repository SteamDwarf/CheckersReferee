import { inject, injectable } from "inversify";
import { IMiddlewareAsync } from "../../common/interfaces";
import { Request, Response, NextFunction } from "express";
import { SERVICES } from "../../common/injectables.types";
import TournamentService from "../Tournament.service";
import { NotFoundError } from "../../errors/NotFound.error";
import { InputError } from "../../errors/Input.error";
import { TournamentSystems } from "../tournaments.model";

@injectable()
class TournamentStartMiddleware implements IMiddlewareAsync {

    constructor(
        @inject(SERVICES.Tournament) private readonly _tournamentService: TournamentService
    ){}

    public async execute(request: Request, response:Response, next: NextFunction) {
        const {id} = request.params;
        const tournament = await this._tournamentService.getTournamentByID(id);
           
        try {
            if(!tournament) return next(new NotFoundError("По указанному id турнир не найден"));
            if(tournament.isStarted) return next(new InputError("Данный турнир уже стартовал"));
            if(tournament.isFinished) return next(new InputError("Данный турнир уже завершен"));
            if(tournament.tournamentSystem !== TournamentSystems.round && 
                tournament.tournamentSystem !== TournamentSystems.swiss
            ) {
                return next(new InputError("Вы указали некорректную систему турнира. Выберите одну из предложенных: 'Круговая' или 'Швейцарская'"));
            }
            if(tournament.tournamentSystem === TournamentSystems.round && tournament.playersIDs.length < 3) {
                return next(new InputError("Для старта турнира по круговой системе нужно как минимум 3 участника"));
            }
            if(tournament.tournamentSystem === TournamentSystems.swiss && tournament.playersIDs.length < 11) {
                return next(new InputError("Для старта турнира по швейцарской системе нужно как минимум 11 участников"));
            }

            next();
        }catch(error) {
            next(error);
        }
        
    }
}

export default TournamentStartMiddleware;