import { ObjectId } from "mongodb";

class BaseEntity {
    private readonly _id;

    constructor(id: ObjectId) {
        this._id = id.toString();
    }

    get id() {
        return this._id;
    }
}

export default BaseEntity;