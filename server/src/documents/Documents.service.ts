import { inject, injectable } from "inversify";
import { REPOSITORIES, SERVICES } from "../common/injectables.types";
import { NotFoundError } from "../errors/NotFound.error";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import TournamentService from "../tournaments/Tournament.service";
import SportsCategoryService from "../sportsCategory/SportsCategory.service";
import PlayerSertificatePlain from "./PlayerSertificatePlain.entity";
import DocumentsRepository from "./Documents.repository";
import PlayerSertificateOptions from "./documentOptions/PlayerSertificate.options";
import RankList from "./RankList.entity";
import RankListPlayer from "./RankListPlayer.entity";
import RankListOptions from "./documentOptions/RankList.options";
import TournamentDocument from "../tournaments/TournamentDocument.entity";

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

        const sportCategory = await this._sportsCategoryService.getSportCategoryByID(playerStats.sportsCategoryID);

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

    public async createRankListDocument(documentTitle: string, tournament: TournamentDocument) {
        let players = await this._playersStatsService.getPlayersStatsFromTournament(tournament.id);

        if(players.length === 0) {
            throw new NotFoundError("В данном турнире нет участников");
        }

        players = this._playersStatsService.sortPlayersStatsByAdamovich(players);
        
        const playersRankLists = players.map((player, i) => new RankListPlayer(i + 1, player));
        const rankListData = new RankList(documentTitle, tournament, playersRankLists);
        

        return await this._documentsRepository.createRankList(
            rankListData,
            rankListData.documentTitle,
            RankListOptions
        )
    }

    public async getRankList(tournamentID: string, recreate: boolean) {
        const tournament = await this._tournamentService.getTournamentByID(tournamentID);

        if(!tournament) {
            throw new NotFoundError("По указанному id турнир не найден");
        }

        const documentTitle = this.getRankListTitle(tournament.id);
        const findedRankList = await this._documentsRepository.findeRankList(documentTitle);

        if(recreate || !findedRankList) return this.createRankListDocument(documentTitle, tournament);

        return findedRankList;
    }

    private getRankListTitle(tournamentID: string) {
        return `Рейтинг-лист_${tournamentID}`;
    }
}

export default DocumentsService;