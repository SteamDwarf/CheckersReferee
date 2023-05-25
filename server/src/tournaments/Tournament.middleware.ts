import { NextFunction, Request, Response } from "express";
import { TournamentSystems } from "../models/tournaments.model";
import { InputError } from "../errors/Input.error";

class TournamentMiddleware {
    public validateTournamentSystem(request: Request, response: Response, next: NextFunction) {
        const tournamentData = request.body;
        
        if(tournamentData.tournamentSystem !== TournamentSystems.round && tournamentData.tournamentSystem !== TournamentSystems.swiss) {
            throw new InputError("Вы указали некорректную систему турнира. Выберите одну из предложенных: 'Круговая' или 'Швейцарская'");
        }

        next();
    }
}

export default TournamentMiddleware;