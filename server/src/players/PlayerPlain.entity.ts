import { ISportsCategoryWithID } from "../models/sportsCategory.model";
import PlayerCreateDTO from "./dtos/PlayerCreate.dto";
import { Gender, IPlayer } from "./players.model";

class PlayerPlain implements IPlayer {
    public readonly firstName: string;
    public readonly middleName: string;
    public readonly lastName: string;
    public readonly gender: Gender;
    public readonly birthday: string;
    public readonly region: string;
    public readonly sportsCategoryID: string;
    public readonly playerStatsIDs: string[];
    public readonly sportsCategoryAbbr: string;
    public readonly sportsOrganization?: string;
    public readonly currentAdamovichRank: number;
    public readonly previousAdamovichRank?: number;

    constructor(playerData: PlayerCreateDTO, sportsCategory: ISportsCategoryWithID) {
        this.firstName = playerData.firstName;
        this.middleName = playerData.middleName;
        this.lastName = playerData.lastName;
        this.gender = playerData.gender;
        this.birthday = playerData.birthday;
        this.region = playerData.region;
        this.sportsCategoryID = sportsCategory._id.toString();
        this.sportsCategoryAbbr = sportsCategory.shortTitle;
        this.playerStatsIDs = [],
        this.currentAdamovichRank = playerData.currentAdamovichRank || sportsCategory.minAdamovichRank;
        this.sportsOrganization = playerData.sportsOrganization
    }

    
    
}

export default PlayerPlain;