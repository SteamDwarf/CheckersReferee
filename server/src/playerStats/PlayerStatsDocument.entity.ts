import { ObjectId } from "mongodb";
import { CheckersColor } from "../common/enums";
import { IPlayerStatsWithID } from "./playerStats.model";

class PlayerStatsDocument {
    private readonly _id: string;
    private readonly _playerID: string;
    private readonly _tournamentID: string;
    private readonly _playerName: string;
    private readonly _birthday: string;
    private readonly _region: string;
    private  _gorinRank: number;
    private readonly _startAdamovichRank: number;
    private  _lastAdamovichRank: number;
    private readonly _startAdamovichTimeStamp: number;
    private  _lastAdamovichTimeStamp: number;
    private _place: number;
    private _score: number;
    private readonly _sportsCategoryID: string;
    private readonly _sportsCategoryAbbr: string;
    private readonly _requiredScore: number;
    private  _colorUsed: number;
    private  _lastColor: CheckersColor;
    private readonly _competitorsID: (string | undefined)[];
    
    constructor(playerStats: IPlayerStatsWithID) {
        this._id = playerStats._id.toString();
        this._playerID = playerStats.playerID;
        this._tournamentID = playerStats.tournamentID;
        this._playerName = playerStats.playerName;
        this._birthday = playerStats.birthday;
        this._region = playerStats.region;
        this._gorinRank = playerStats.gorinRank;
        this._startAdamovichRank = playerStats.startAdamovichRank;
        this._lastAdamovichRank = playerStats.lastAdamovichRank;
        this._startAdamovichTimeStamp = playerStats.startAdamovichTimeStamp;
        this._lastAdamovichTimeStamp = playerStats.lastAdamovichTimeStamp;
        this._place = playerStats.place;
        this._score = playerStats.score;
        this._sportsCategoryID = playerStats.sportsCategoryID;
        this._sportsCategoryAbbr = playerStats.sportsCategoryAbbr;
        this._requiredScore = playerStats.requiredScore;
        this._colorUsed = playerStats.colorUsed;
        this._lastColor = playerStats.lastColor;
        this._competitorsID = playerStats.competitorsID;
    }

    public get id(): string {
        return this._id;
    }

    public get playerID(): string {
        return this._playerID;
    }

    public get tournamentID(): string {
        return this._tournamentID;
    }

    public get playerName(): string {
        return this._playerName;
    }

    public get birthday(): string {
        return this._birthday;
    }

    public get region(): string {
        return this._region;
    }

    public get gorinRank(): number {
        return this._gorinRank;
    }

    public set gorinRank(newRank: number) {
        this._gorinRank = newRank;
    }

    public get startAdamovichRank(): number {
        return this._startAdamovichRank;
    }

    public get lastAdamovichRank(): number {
        return this._lastAdamovichRank;
    }

    public set lastAdamovichRank(newRank: number) {
        if(newRank >= 255) {
            this._lastAdamovichRank = newRank;
            this._lastAdamovichTimeStamp = Date.now();
        }
    }


    public get startAdamovichTimeStamp(): number {
        return this._startAdamovichTimeStamp;
    }

    public get lastAdamovichTimeStamp(): number {
        return this._lastAdamovichTimeStamp;
    }


    public get place(): number {
        return this._place;
    }

    public set place(newPlace: number) {
        this._place = newPlace;
    }

    public get score(): number {
        return this._score;
    }

    public set score(newScore: number) {
        this._score = newScore;
    }

    public get sportsCategoryID(): string {
        return this._sportsCategoryID;
    }

    public get sportsCategoryAbbr(): string {
        return this._sportsCategoryAbbr;
    }

    public get colorUsed(): number {
        return this._colorUsed;
    }

    public get requiredScore(): number {
        return this._requiredScore;
    }

    public get lastColor(): CheckersColor {
        return this._lastColor;
    }

    public set lastColor(newColor: CheckersColor) {
        //TODO чет намутил с this._colorUsed === 0
        const colorUsed = this._colorUsed === 0 || this._lastColor !== newColor ? 1 : this._colorUsed + 1;
    
        this._colorUsed = colorUsed;
        this._lastColor = newColor;
    }

    //TODO возвращать копию
    public get competitorsID(): (string | undefined)[] {
        return this._competitorsID;
    }

    public get data() {
        return {
            _id: this._id.toString(),
            playerID: this.playerID,
            tournamentID: this.tournamentID,
            playerName: this.playerName,
            birthday: this.birthday,
            region: this.region,
            gorinRank: this.gorinRank,
            startAdamovichRank: this.startAdamovichRank,
            lastAdamovichRank: this.lastAdamovichRank,
            startAdamovichTimeStamp: this.startAdamovichTimeStamp,
            lastAdamovichTimeStamp: this.lastAdamovichTimeStamp,
            place: this.place,
            score: this.score,
            sportsCategoryID: this.sportsCategoryID,
            sportsCategoryAbbr: this.sportsCategoryAbbr,
            requiredScore: this.requiredScore,
            colorUsed: this.colorUsed,
            lastColor: this.lastColor,
            competitorsID: this.competitorsID
        }
    }

    public get clone() {
        return new PlayerStatsDocument({...this.data, _id: new ObjectId(this._id)});
    }

    public addCompetitor(competitorID: string) {
        this._competitorsID.push(competitorID);
    }

    public popCompetitor() {
        return this._competitorsID.pop();
    }
}

export default PlayerStatsDocument;