import { Gender, IPlayerWithId } from "./players.model";

class PlayerDocument {
    private readonly _id: string;
    private readonly _firstName: string;
    private readonly _middleName: string;
    private readonly _lastName: string;
    private readonly _gender: Gender;
    private readonly _birthday: string;
    private readonly _region: string;
    private readonly _sportsCategoryID: string;
    private readonly _playerStatsIDs: string[];
    private readonly _sportsCategoryAbbr: string;
    private readonly _sportsOrganization?: string;
    private  _currentAdamovichRank: number;
    private  _previousAdamovichRank?: number;
    
    constructor(playerData: IPlayerWithId) {
        this._id = playerData._id.toString();
        this._firstName = playerData.firstName;
        this._middleName = playerData.middleName;
        this._lastName = playerData.lastName;
        this._gender = playerData.gender;
        this._birthday = playerData.birthday;
        this._region = playerData.region;
        this._sportsCategoryID = playerData.sportsCategoryID;
        this._sportsCategoryAbbr = playerData.sportsCategoryAbbr;
        this._playerStatsIDs = playerData.playerStatsIDs,
        this._currentAdamovichRank = playerData.currentAdamovichRank;
        this._sportsOrganization = playerData.sportsOrganization;
        this._previousAdamovichRank = playerData.previousAdamovichRank;
    }

    public get id(): string {
        return this._id;
    }
    public get firstName() : string {
        return this._firstName;
    }
    public get middleName() : string {
        return this._middleName;
    }
    public get lastName() : string {
        return this._lastName;
    }
    public get fullName() : string {
        return `${this._lastName} ${this._firstName} ${this._middleName}`;
    }
    public get gender() : Gender {
        return this._gender;
    }
    public get birthday() : string {
        return this._birthday;
    }
    public get region() : string {
        return this._region;
    }
    public get sportsCategoryID() : string {
        return this._sportsCategoryID;
    }
    public get sportsCategoryAbbr() : string {
        return this._sportsCategoryAbbr;
    }
    
    public get sportsOrganization() : string | undefined {
        return this._sportsOrganization;
    }

    public get currentAdamovichRank() : number {
        return this._currentAdamovichRank;
    }
    public set currentAdamovichRank(newRank: number) {
        this._previousAdamovichRank = this.currentAdamovichRank;
        this._currentAdamovichRank = newRank;
    }

    public get previousAdamovichRank() : number | undefined {
        return this._previousAdamovichRank;
    }

    public get age() {
        const today = new Date();
        const birthdayDate = new Date(this._birthday);
        const monthDiff = today.getMonth() - birthdayDate.getMonth();
    
        let age = today.getFullYear() - birthdayDate.getFullYear();
    
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdayDate.getDate())) {
            age--;
        }
    
        return age;
    }

    public get data() {
        return {
            _id: this._id,
            firstName: this._firstName,
            middleName: this._middleName,
            lastName: this._lastName,
            gender: this._gender,
            birthday: this._birthday,
            region: this._region,
            sportsCategoryID: this._sportsCategoryID,
            playerStatsIDs: this._playerStatsIDs,
            sportsCategoryAbbr: this._sportsCategoryAbbr,
            sportsOrganization: this._sportsOrganization,
            currentAdamovichRank: this._currentAdamovichRank,
            previousAdamovichRank: this._previousAdamovichRank
        }
    }

    public addPlayerStats(playerStatsID: string | undefined) {
        if(playerStatsID) {
            this._playerStatsIDs.push(playerStatsID);
        }
    }
}

export default PlayerDocument