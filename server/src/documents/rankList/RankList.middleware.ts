import { inject, injectable } from "inversify";
import { SERVICES } from "../../common/injectables.types";
import TournamentService from "../../tournaments/Tournament.service";
import { NextFunction, Request, Response } from "express";
import { InputError } from "../../errors/Input.error";
import { NotFoundError } from "../../errors/NotFound.error";

@injectable()
class RankListMiddleware{
    constructor(
        @inject(SERVICES.Tournament) private readonly _tournamentService: TournamentService
    ) {}

    public async validateGetRequest(request: Request, response: Response, next: NextFunction) {
        const tournamentID = request.query.tournamentID?.toString();

        this.checkTournamentIDExist(tournamentID);
        this.checkTournamentExist(tournamentID as string);

        next();
    }

    private checkTournamentIDExist(tournamentID: string | undefined) {
        if(!tournamentID) {
            throw new InputError("Необходимо указать id турнира в параметры запроса");
        }
    }

    private async checkTournamentExist(tournamentID: string) {
        const tournament = await this._tournamentService.getTournamentByID(tournamentID);

        if(!tournament) {
            throw new NotFoundError("Указанный турнир не найден");
        }
    }
}

export default RankListMiddleware;