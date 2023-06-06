import { ObjectId } from "mongodb";
import BaseDocument from "../../common/BaseDocument.entity";

class RankList extends BaseDocument{
    private readonly _tournamentID;

    constructor(
        id: ObjectId,
        documentTitle: string,
        tournamentID: string,
    ){
        super(id,documentTitle);

        this._tournamentID = tournamentID;
    }

    get tournamentID() {
        return this._tournamentID;
    }
}

export default RankList;