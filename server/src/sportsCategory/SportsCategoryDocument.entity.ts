import { ISportsCategoryWithID } from "./sportsCategory.model";

class SportsCategoryDocument {
    private readonly _id: string;
    private readonly _title: string;
    private readonly _shortTitle: string;
    private readonly _minAdamovichRank: number;
    private readonly _maxAdamovichRank: number;
    private readonly _categoryCoefficient: number;
    private readonly _requiredTournamentCoefficient?: number;
    private readonly _index: number;
    

    constructor(sportsCategory: ISportsCategoryWithID) {
        this._id = sportsCategory._id.toString();
        this._title = sportsCategory.title;
        this._shortTitle = sportsCategory.shortTitle;
        this._minAdamovichRank = sportsCategory.minAdamovichRank;
        this._maxAdamovichRank = sportsCategory.maxAdamovichRank;
        this._categoryCoefficient = sportsCategory.categoryCoefficient;
        this._requiredTournamentCoefficient = sportsCategory.requiredTournamentCoefficient;
        this._index = sportsCategory.index;
    }

    public get id() {
        return this._id;
    }
    public get title(): string {
        return this._title;
    }

    public get shortTitle(): string {
        return this._shortTitle;
    }
    public get minAdamovichRank(): number {
        return this._minAdamovichRank;
    }
    public get maxAdamovichRank(): number {
        return this._maxAdamovichRank;
    }

    public get categoryCoefficient(): number {
        return this._categoryCoefficient;
    }
    public get requiredTournamentCoefficient(): number | undefined {
        return this._requiredTournamentCoefficient;
    }

    public get index(): number {
        return this._index;
    }

    public get data() {
        return {
            _id: this._id,
            title: this._title,
            shortTitle: this._shortTitle,
            minAdamovichRank: this._minAdamovichRank,
            maxAdamovichRank: this._maxAdamovichRank,
            categoryCoefficient: this._categoryCoefficient,
            requiredTournamentCoefficient: this._requiredTournamentCoefficient,
            index: this._index
        }
    }
}

export default SportsCategoryDocument;