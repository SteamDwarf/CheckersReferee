import { IPlayer, IPlayerWithId } from "./players.model";
import { ISportsCategoryWithID } from "../models/sportsCategory.model";
import SportsCategoryService from "../sportsCategory/SportsCategory.service";
import { NotFoundError } from "../errors/NotFound.error";
import BaseService from "../common/Base.service";
import DataBase from "../DB/DataBase";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import { inject, injectable } from "inversify";
import { MAIN, SERVICES } from "../common/injectables.types";

@injectable()
class PlayerService extends BaseService {
    constructor(
        @inject(MAIN.Database) db: DataBase, 
        @inject(SERVICES.SportsCategory) private readonly _sportsCategoryService: SportsCategoryService
    ) {
        super(db);
    }
    
    public async createPlayer(playerData: IPlayer) {
        const sportCategory = await this._sportsCategoryService.findSportsCategoryByID(playerData.sportsCategoryID);

        if(!sportCategory) throw new NotFoundError("По указанному id спортивный разряд не найден");
    
        playerData = this.setSportCategory(sportCategory, playerData);
        playerData.playerStatsIDs = [];

        return await this.db.createDocument(this.db.collections.players, playerData) as IPlayerWithId;
    }

    public async getPlayer(id: string) {
        return await this.db.findDocumentById(this.db.collections.players, id) as IPlayerWithId;
    }

    //TODO вынести paginateData в класс UtilsService
    public async getAllPlayers(page: number, limit: number) {
        const players = await this.db.findDocuments(this.db.collections.players) as IPlayerWithId[];

        return this.paginateData(players, limit, page);
    }

    public async getPlayersByID(ids: string[]) {
        const players = await this.db.findDocumentsById(this.db.collections.players, ids) as IPlayerWithId[];

        return players;
    }

    public async updatePlayer (id: string, playerData: IPlayer){
        const playerForUpdate = await this.getPlayer(id);
    
        if(!playerForUpdate) throw new NotFoundError("По указанному id игрок не найден");
    
        const updatedPlayer = await this.db.updateDocument(this.db.collections.players, id, playerData) as IPlayerWithId;
    
        return updatedPlayer;
    }

    public async saveStatsToPlayers(players: IPlayerWithId[], playerStats: IPlayerStatsWithID[]) {
        const updatedPlayers = [];

        for(const player of players) {
            const playerStat = playerStats.find(stat => stat.playerID === player._id.toString());
            player.playerStatsIDs.push(playerStat?._id.toString() as string);

            const updatedPlayer = await this.updatePlayer(player._id.toString(), player);
            updatedPlayers.push(updatedPlayer);
        }

        return updatedPlayers;
    }

    public async updatePlayersAfterTournament(playersStats: IPlayerStatsWithID[]){
        const updatedPlayers = [];
    
        for(const playerStats of playersStats) {
            const player = await this.getPlayer(playerStats.playerID);
    
            player.previousAdamovichRank = player.currentAdamovichRank;
            player.currentAdamovichRank = playerStats.lastAdamovichRank;
    
            const updatedPlayer = await this.updatePlayer(player._id.toString(), player);
    
            updatedPlayers.push(updatedPlayer);
        }
    
        return updatedPlayers;
    }

    public async deletePlayer (id: string) {
        const playerForDelete = await this.getPlayer(id);
    
        if(!playerForDelete) throw new NotFoundError("По указанному id игрок не найден");
    
        const deletingResult = await this.db.deleteDocument(this.db.collections.players, id);
    
        return deletingResult;
    }

    private setSportCategory (sportCategory: ISportsCategoryWithID, playerDocument: IPlayer) {
        const playerCopy = {...playerDocument};
    
        playerCopy.sportsCategoryID = sportCategory._id.toString();
        playerCopy.sportsCategoryAbbr = sportCategory.shortTitle;
        
        if(!playerCopy.currentAdamovichRank) {
            playerCopy.currentAdamovichRank = sportCategory.minAdamovichRank;
        }
    
        return playerCopy;
    }
    
}

export default PlayerService;