import { IPlayer, IPlayerWithId } from "./players.model";
import { ISportsCategoryWithID } from "../sportsCategory/sportsCategory.model";
import SportsCategoryService from "../sportsCategory/SportsCategory.service";
import { NotFoundError } from "../errors/NotFound.error";
import BaseService from "../common/Base.service";
import DataBase from "../DB/DataBase";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import { Container, inject, injectable } from "inversify";
import { MAIN, REPOSITORIES, SERVICES } from "../common/injectables.types";
import PlayerCreateDTO from "./dtos/PlayerCreate.dto";
import PlayerDocument from "./PlayerDocument.entity";
import PlayerPlain from "./PlayerPlain.entity";
import PlayerRepository from "./Players.repository";
import PlayerUpdateDTO from "./dtos/PlayerUpdate.dto";
import TournamentService from "../tournaments/Tournament.service";
import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";

@injectable()
class PlayerService extends BaseService {
    

    constructor(
        //TODO убрать db
        @inject(MAIN.Database) db: DataBase, 
        @inject(SERVICES.SportsCategory) private readonly _sportsCategoryService: SportsCategoryService,
        @inject(REPOSITORIES.Player) private readonly _playerRepository: PlayerRepository,
        @inject(SERVICES.Tournament) private readonly _tournamentService: TournamentService
    ) {
        super(db);
    }
    
    public async createPlayer(playerData: PlayerCreateDTO) {
        const sportCategory = await this._sportsCategoryService.getSportsCategoryByID(playerData.sportsCategoryID);

        if(!sportCategory) throw new NotFoundError("По указанному id спортивный разряд не найден");
        
        const playerPlain = new PlayerPlain(playerData, sportCategory);
        const playerPlainDocument = await this._playerRepository.createPlayer(playerPlain);
        const playerDocument = new PlayerDocument(playerPlainDocument);

        return playerDocument;
    }

    public async getPlayerByID(id: string) {
        const playerPlainDocument = await this._playerRepository.getPlayerByID(id);

        if(playerPlainDocument) {
            const playerDocument = new PlayerDocument(playerPlainDocument);
            return playerDocument;
        }

        return null;
    }

    //TODO вынести paginateData в класс UtilsService
    public async getAllPlayers() {
        const playersPlainDocuments = await this._playerRepository.getAllPlayers();
        const playersDocuments = playersPlainDocuments.map(document => new PlayerDocument(document));

        return playersDocuments;
    }

    public async getPlayersByID(ids: string[]) {
        const playersPlainDocuments = await this._playerRepository.getPlayersById(ids);
        const playersDocuments = playersPlainDocuments.map(player => new PlayerDocument(player));

        return playersDocuments;
    }

    public async getPlayersFromTournament(tournamentID: string) {
        const tournament = await this._tournamentService.getTournamentByID(tournamentID);

        if(!tournament) throw new NotFoundError("По указанному id турнир не найден");

        const playersIDs = tournament.playersIDs as string[];
        const players = await this.getPlayersByID(playersIDs);

        return players;
    }

    public async updatePlayer (id: string, playerData: PlayerUpdateDTO){    
        const playerPlainDocument = await this._playerRepository.updatePlayer(id, playerData);
        const playerDocument = new PlayerDocument(playerPlainDocument);
    
        return playerDocument;
    }

    public async updatePlayerDocument(id: string, playerDocument: PlayerDocument) {
        const {_id: _, ...playerData} = playerDocument.data;
        return await this.updatePlayer(id, playerData);
    }

    public async saveStatsToPlayers(players: PlayerDocument[], playerStats: PlayerStatsDocument[]) {
        const updatedPlayers = [];
        
        for(const player of players) {
            const playerStat = playerStats.find(stat => stat.playerID === player.id.toString());
            player.addPlayerStats(playerStat?.id);
            
            const updatedPlayer = await this.updatePlayerDocument(player.id.toString(), player);
            updatedPlayers.push(updatedPlayer);
        }

        return updatedPlayers;
    }

    public async updatePlayersAfterTournament(playersStats: PlayerStatsDocument[]){
        const updatedPlayers = [];
    
        for(const playerStats of playersStats) {
            const player = await this.getPlayerByID(playerStats.playerID);
    
            if(player) {
                player.currentAdamovichRank = playerStats.lastAdamovichRank;
    
                const updatedPlayer = await this.updatePlayerDocument(player.id.toString(), player);
        
                updatedPlayers.push(updatedPlayer);
            }
            
        }
    
        return updatedPlayers;
    }

    public async deletePlayer (id: string) {    
        const deletingResult = await this._playerRepository.deletePlayer(id);
    
        return deletingResult;
    }
    
    
    
}

export default PlayerService;