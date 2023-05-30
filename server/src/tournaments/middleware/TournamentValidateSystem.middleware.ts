import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "../../common/interfaces";
import { InputError } from "../../errors/Input.error";
import { TournamentSystems } from "../../models/tournaments.model";
import { injectable } from "inversify";

@injectable()
class TournamentValidateSystemMiddleware implements IMiddleware{
    public execute(request: Request, response:Response, next: NextFunction){
        const tournamentData = request.body;
        
        if(tournamentData.tournamentSystem !== TournamentSystems.round && tournamentData.tournamentSystem !== TournamentSystems.swiss) {
            return next(new InputError("Вы указали некорректную систему турнира. Выберите одну из предложенных: 'Круговая' или 'Швейцарская'"));
        }

        next();
    }
}

export default TournamentValidateSystemMiddleware;