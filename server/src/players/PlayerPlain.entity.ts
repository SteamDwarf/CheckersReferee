import SportsCategoryDocument from "../sportsCategory/SportsCategoryDocument.entity";
import PlayerCreateDTO from "./dtos/PlayerCreate.dto";
import { Gender, IPlayer, SportsCategoryStatus } from "./players.model";

class PlayerPlain {
    public readonly firstName: string;
    public readonly middleName?: string;
    public readonly lastName: string;
    public readonly gender: Gender;
    public readonly birthday: string;
    public readonly region: string;
    public readonly playerStatsIDs: string[];
    public readonly sportsCategoryID: string;
    public readonly sportsCategoryAbbr: string;
    public readonly newSportsCategoryID: string;
    public readonly newSportsCategoryAbbr: string;
    public readonly newSportsCategoryStatus: SportsCategoryStatus;
    public readonly newSportsCategoryTimestamp: string;
    public readonly sportsOrganization?: string;
    public readonly currentAdamovichRank: number;
    public readonly previousAdamovichRank?: number;

    constructor(playerData: PlayerCreateDTO, sportsCategory: SportsCategoryDocument) {
        this.firstName = playerData.firstName;
        this.middleName = playerData.middleName;
        this.lastName = playerData.lastName;
        this.gender = playerData.gender;
        this.birthday = playerData.birthday;
        this.region = playerData.region;
        this.sportsCategoryID = sportsCategory.id.toString();
        this.sportsCategoryAbbr = sportsCategory.shortTitle;
        this.newSportsCategoryID = sportsCategory.id.toString();
        this.newSportsCategoryAbbr = sportsCategory.shortTitle;
        this.newSportsCategoryStatus = SportsCategoryStatus.gray;
        this.newSportsCategoryTimestamp = "";
        this.playerStatsIDs = [],
        this.currentAdamovichRank = playerData.currentAdamovichRank || sportsCategory.minAdamovichRank;
        this.sportsOrganization = playerData.sportsOrganization || "",
        this.previousAdamovichRank = this.currentAdamovichRank;
    }

    
    
}

export default PlayerPlain;