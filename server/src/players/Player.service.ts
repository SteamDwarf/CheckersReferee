import { createDocument, deleteDocument, findDocumentById, findDocuments, getDBCollections, updateDocument } from "../database/database";
import { IPlayer, IPlayerWithId } from "./players.model";
import { ISportsCategoryWithID } from "../models/sportsCategory.model";
import SportsCategoryService from "../sportsCategory/SportsCategory.service";
import { paginateData } from "../utils/controllers.utils";
import { NotFoundError } from "../errors/NotFound.error";

class PlayerService {
    private readonly _sportsCategoryService;

    constructor(sportsCategoryService: SportsCategoryService) {
        this._sportsCategoryService = sportsCategoryService;
    }

    public async createPlayer(playerData: IPlayer) {
        const sportCategory = await this._sportsCategoryService.findSportsCategoryByID(playerData.sportsCategoryID);

        if(!sportCategory) throw new NotFoundError("По указанному id спортивный разряд не найден");
    
        playerData = this.setSportCategory(sportCategory, playerData);
        playerData.playerStatsIDs = [];

        return await createDocument(getDBCollections().players, playerData) as IPlayerWithId;
    }

    public async getPlayer(id: string) {
        return await findDocumentById(getDBCollections().players, id) as IPlayerWithId;
    }

    //TODO вынести paginateData в класс UtilsService
    public async getPlayers(page: number, limit: number) {
        const players = await findDocuments(getDBCollections().players) as IPlayerWithId[];

        return paginateData(players, limit, page);
    }

    public async updatePlayer (id: string, playerData: IPlayer){
        const playerForUpdate = await this.getPlayer(id);
    
        if(!playerForUpdate) throw new NotFoundError("По указанному id игрок не найден");
    
        const updatedPlayer = await updateDocument(getDBCollections().players, id, playerData) as IPlayerWithId;
    
        return updatedPlayer;
    }

    public async deletePlayer (id: string) {
        const playerForDelete = await this.getPlayer(id);
    
        if(!playerForDelete) throw new NotFoundError("По указанному id игрок не найден");
    
        const deletingResult = await deleteDocument(getDBCollections().players, id);
    
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