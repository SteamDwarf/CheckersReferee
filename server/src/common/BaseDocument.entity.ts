import { ObjectId } from "mongodb";
import BaseEntity from "./Base.entity";

class BaseDocument extends BaseEntity{
    private readonly _documentTile

    constructor(id:ObjectId, documentTitle: string) {
        super(id);
        this._documentTile = documentTitle;
    }

    get documentTitle() {
        return this._documentTile;
    }
}

export default BaseDocument;