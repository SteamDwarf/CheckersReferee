import { inject, injectable } from "inversify";
import { REPOSITORIES, SERVICES } from "../common/injectables.types";
import { NotFoundError } from "../errors/NotFound.error";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import TournamentService from "../tournaments/Tournament.service";
import SportsCategoryService from "../sportsCategory/SportsCategory.service";
import PlayerSertificatePlain from "./PlayerSertificatePlain.entity";
import DocumentsRepository from "./Documents.repository";
import PlayerSertificateOptions from "./documentOptions/PlayerSertificate.options";

@injectable()
class DocumentsService {
    constructor(
        @inject(SERVICES.PlayerStats) private readonly _playersStatsService: PlayerStatsService,
        @inject(SERVICES.Tournament) private readonly _tournamentService: TournamentService,
        @inject(SERVICES.SportsCategory) private readonly _sportsCategoryService: SportsCategoryService,
        @inject(REPOSITORIES.Document) private readonly _documentsRepository: DocumentsRepository
    ) {

    }

    public async getPlayerCertificate(playerStatsID: string) {
        const playerStats = await this._playersStatsService.getPlayerStatsByID(playerStatsID);

        if(!playerStats) {
            throw new NotFoundError("По указанному id статистика игрока не найдена");
        }

        const tournament = await this._tournamentService.getTournamentByID(playerStats.tournamentID);

        if(!tournament) {
            throw new NotFoundError("По указанному id турнир не найден");
        }

        const sportCategory = await this._sportsCategoryService.getSportsCategoryByID(playerStats.sportsCategoryID);

        if(!sportCategory) {
            throw new NotFoundError("По указанному id спортивная категория не найдена");
        }

        const sertificateData = new PlayerSertificatePlain(playerStats, tournament, sportCategory);
        return await this._documentsRepository.createPlayerSertificate(
            sertificateData,
            sertificateData.documentTitle,
            PlayerSertificateOptions
        )
    }
}

export default DocumentsService;