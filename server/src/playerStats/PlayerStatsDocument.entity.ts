import { ObjectId } from "mongodb";
import { CheckersColor } from "../common/enums";
import { IPlayerStatsWithID } from "./playerStats.model";
import GameDocument from "../games/GameDocument.entity";
import { SportsCategoryStatus } from "../players/players.model";
import SportsCategoryDocument from "../sportsCategory/SportsCategoryDocument.entity";

class PlayerStatsDocument {
    private readonly _id: string;
    private readonly _playerID: string;
    private readonly _tournamentID: string;
    private readonly _playerName: string;
    private readonly _birthday: string;
    private readonly _age: number;
    private readonly _region: string;
    private readonly _sportsOrganization?: string;
    private  _gorinRank: number;
    private  _startAdamovichRank: number;
    private  _lastAdamovichRank: number;
    private  _startAdamovichTimeStamp: number;
    private  _lastAdamovichTimeStamp: number;
    private _place: number;
    private _score: number;
    private _normScore: number;
    private _tournamentCoefficient: number;
    private readonly _sportsCategoryID: string;
    private readonly _sportsCategoryAbbr: string;
    private _newSportsCategoryID: string;
    private _newSportsCategoryAbbr: string;
    private _newSportsCategoryStatus: SportsCategoryStatus;
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
        this._age = playerStats.age;
        this._region = playerStats.region;
        this._sportsOrganization = playerStats.sportsOrganization;
        this._gorinRank = playerStats.gorinRank;
        this._startAdamovichRank = playerStats.startAdamovichRank;
        this._lastAdamovichRank = playerStats.lastAdamovichRank;
        this._startAdamovichTimeStamp = playerStats.startAdamovichTimeStamp;
        this._lastAdamovichTimeStamp = playerStats.lastAdamovichTimeStamp;
        this._place = playerStats.place;
        this._score = playerStats.score;
        this._normScore = playerStats.normScore;
        this._tournamentCoefficient = playerStats.tournamentCoefficient;
        this._sportsCategoryID = playerStats.sportsCategoryID;
        this._sportsCategoryAbbr = playerStats.sportsCategoryAbbr;
        this._newSportsCategoryID = playerStats.newSportsCategoryID || "";
        this._newSportsCategoryAbbr = playerStats.newSportsCategoryAbbr || "";
        this._newSportsCategoryStatus = playerStats.newSportsCategoryStatus || SportsCategoryStatus.gray;
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
    public get age(): number {
        return this._age;
    }

    public get region(): string {
        return this._region;
    }

    public get sportsOrganization(): string | undefined {
        return this._sportsOrganization;
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
            this._startAdamovichRank = this._lastAdamovichRank;
            this._startAdamovichTimeStamp = Date.now();

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

    /* public set score(newScore: number) {
        this._score = newScore;
    } */

    public get normScore(): number {
        return this._normScore;
    }

    /* public set normScore(newScore: number) {
        this._normScore = newScore;
    } */

    public get tournamentCoefficient(): number {
        return this._tournamentCoefficient;
    }

    public get sportsCategoryID(): string {
        return this._sportsCategoryID;
    }

    public get sportsCategoryAbbr(): string {
        return this._sportsCategoryAbbr;
    }

    public get newSportsCategoryID(): string {
        return this._newSportsCategoryID;
    }
    public get newSportsCategoryAbbr(): string {
        return this._newSportsCategoryAbbr;
    }

    public get newSportsCategoryStatus(): SportsCategoryStatus {
        return this._newSportsCategoryStatus;
    }

    public set newSportsCategoryStatus(status: SportsCategoryStatus) {
        this._newSportsCategoryStatus = status;
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
            age: this.age,
            region: this.region,
            sportsOrganization: this.sportsOrganization || '',
            gorinRank: this.gorinRank,
            startAdamovichRank: this.startAdamovichRank,
            lastAdamovichRank: this.lastAdamovichRank,
            startAdamovichTimeStamp: this.startAdamovichTimeStamp,
            lastAdamovichTimeStamp: this.lastAdamovichTimeStamp,
            place: this.place,
            score: this.score,
            normScore: this._normScore,
            tournamentCoefficient: this._tournamentCoefficient,
            sportsCategoryID: this.sportsCategoryID,
            sportsCategoryAbbr: this.sportsCategoryAbbr,
            newSportsCategoryID: this.newSportsCategoryID,
            newSportsCategoryAbbr: this.newSportsCategoryAbbr,
            newSportsCategoryStatus: this._newSportsCategoryStatus,
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

    public changeScore(
        competitor: PlayerStatsDocument | undefined,
        prevScore: number,
        curScore: number
    ) {
        this._score = this._score - prevScore + curScore;

        if(competitor) {
            this._normScore =  this._normScore - prevScore + curScore;
        }
    }

    public setNewSportCategory(
        oldSportCategory: SportsCategoryDocument, 
        newSportCategory: SportsCategoryDocument
    ){
        this._newSportsCategoryID = newSportCategory.id;
        this._newSportsCategoryAbbr = newSportCategory.shortTitle;

        if(oldSportCategory.index > newSportCategory.index) {
            this._newSportsCategoryStatus = SportsCategoryStatus.red;
        } else if(oldSportCategory.index < newSportCategory.index) {
            this._newSportsCategoryStatus = SportsCategoryStatus.green;
        } else {
            this._newSportsCategoryStatus = SportsCategoryStatus.gray;
        }
    }

    /**
     * Данная функция, в зависимости от того меняется результат уже проведенной партии или еще нет,
     * возвращает нужный рейтинг Адамовича. И если партия уже была сыграна, то меняет текущий рейтинг
     * на предыдущий
     * @param oldGameData - старые данные партии
     * @param playerStats - данные статистики игрока
     * @returns рейтинг Адамовича
     */
    public chooseAdamovichRank(oldGameData: GameDocument) {
        if(oldGameData.player1Score === 0 && oldGameData.player2Score === 0) {
            return this._lastAdamovichRank;
        } else {
            this._lastAdamovichRank = this._startAdamovichRank;
            return this._lastAdamovichRank;
        }
    }
}

export default PlayerStatsDocument;