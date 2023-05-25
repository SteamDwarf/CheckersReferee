import { IPlayer, IPlayerWithId } from "./players.model";
import { ISportsCategoryWithID } from "../models/sportsCategory.model";
import SportsCategoryService from "../sportsCategory/SportsCategory.service";
import { NotFoundError } from "../errors/NotFound.error";
import BaseService from "../common/Base.service";
import DataBase from "../DB/DataBase";

class PlayerService extends BaseService {
    private readonly _sportsCategoryService;

    constructor(db: DataBase, sportsCategoryService: SportsCategoryService) {
        super(db);
        this._sportsCategoryService = sportsCategoryService;
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
    public async getPlayers(page: number, limit: number) {
        const players = await this.db.findDocuments(this.db.collections.players) as IPlayerWithId[];

        return this.paginateData(players, limit, page);
    }

    public async updatePlayer (id: string, playerData: IPlayer){
        const playerForUpdate = await this.getPlayer(id);
    
        if(!playerForUpdate) throw new NotFoundError("По указанному id игрок не найден");
    
        const updatedPlayer = await this.db.updateDocument(this.db.collections.players, id, playerData) as IPlayerWithId;
    
        return updatedPlayer;
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