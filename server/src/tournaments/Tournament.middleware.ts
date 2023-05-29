import { NextFunction, Request, Response } from "express";
import { TournamentSystems } from "../models/tournaments.model";
import { InputError } from "../errors/Input.error";
import TournamentService from "./Tournament.service";
import { NotFoundError } from "../errors/NotFound.error";
import { inject, injectable } from "inversify";
import { SERVICES } from "../common/injectables.types";

@injectable()
class TournamentMiddleware {
    constructor(@inject(SERVICES.Tournament) private readonly _tournamentService: TournamentService) {}

    public validateTournamentSystem(request: Request, response: Response, next: NextFunction) {
        const tournamentData = request.body;
        
        if(tournamentData.tournamentSystem !== TournamentSystems.round && tournamentData.tournamentSystem !== TournamentSystems.swiss) {
            throw new InputError("Вы указали некорректную систему турнира. Выберите одну из предложенных: 'Круговая' или 'Швейцарская'");
        }

        next();
    }

    public async checkTournamentforStart(request: Request, response: Response, next: NextFunction) {
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

    public async checkTournamentForFinish(request: Request, response: Response, next: NextFunction) {
        const {id} = request.params;
        const tournament = await this._tournamentService.getTournamentByID(id);

        if(!tournament) throw new NotFoundError("По указанному id турнир не найден");
        if(tournament.isFinished) throw new InputError("Данный турнир уже стартовал");

        next();
    }

    public async checkTournamentForTourFinish(request: Request, response: Response, next: NextFunction) {
        const {id} = request.params;
        const tournament = await this._tournamentService.getTournamentByID(id);

        if(!tournament) throw new NotFoundError("По указанному id турнир не найден");
        if(!tournament.isStarted) throw new NotFoundError("Данный турнир еще не стартовал");
        if(tournament.isFinished) throw new NotFoundError("Данный турнир уже завершился");

        next();
    }
}

//export default TournamentMiddleware;