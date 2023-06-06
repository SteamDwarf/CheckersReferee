import { ObjectId } from "mongodb"

export interface IRankList {
    tournamentID: string,
    documentTitle: string
}
export interface IRankListWithID extends IRankList{
    _id: ObjectId,
}


export const rankListsSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "tournamentID",
                "documentTitle"
            ],
            additionalProperties: false,
            properties: {
                "_id": {
                    bsonType: "objectId",
                    description: "Поле _id быть ObjectId"
                },
                "tournamentID": {
                    bsonType: "string",
                    description: "Поле tournamentID является обязательным и должно быть string"
                },
                "documentTitle": {
                    bsonType: "string",
                    description: "Поле documentTitle является обязательным и должно быть string"
                },
            }
        }
    }
}