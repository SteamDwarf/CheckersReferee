import { inject, injectable } from "inversify";
import { IMiddlewareAsync } from "../../common/interfaces";
import { Request, Response, NextFunction } from "express";
import { SERVICES } from "../../common/injectables.types";
import TournamentService from "../Tournament.service";
import { NotFoundError } from "../../errors/NotFound.error";
import { InputError } from "../../errors/Input.error";
import { TournamentSystems } from "../../models/tournaments.model";

@injectable()
class TournamentStartMiddleware implements IMiddlewareAsync {

    constructor(
        @inject(SERVICES.Tournament) private readonly _tournamentService: TournamentService
    ){}

    public async execute(request: Request, response:Response, next: NextFunction) {
        const {id} = request.params;
        const tournamentForStart = await this._tournamentService.getTournamentByID(id);

        if(!tournamentForStart) throw new NotFoundError("По указанному id турнир не найден");
        if(tournamentForStart.isStarted) throw new InputError("Данный турнир уже стартовал");
        if(tournamentForStart.isFinished) throw new InputError("Данный турнир уже завершен");
        if(tournamentForStart.tournamentSystem !== TournamentSystems.round && tournamentForStart.tournamentSystem !== TournamentSystems.swiss) {
            throw new InputError("Вы указали некорректную систему турнира. Выберите одну из предложенных: 'Круговая' или 'Швейцарская'");
        }
        if(tournamentForStart.tournamentSystem === TournamentSystems.round && tournamentForStart.playersIDs.length < 3) {
            throw new InputError("Для старта турнира по круговой системе нужно как минимум 3 участника");
        }
        if(tournamentForStart.tournamentSystem === TournamentSystems.swiss && tournamentForStart.playersIDs.length < 11) {
            throw new InputError("Для старта турнира по швейцарской системе нужно как минимум 11 участников");
        }

        next();
    }
}

export default TournamentStartMiddleware;