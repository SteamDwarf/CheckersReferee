import { ObjectId } from "mongodb"
export interface ISportsCategory {
    title: string,
    shortTitle: string,
    minAdamovichRank: number,
    maxAdamovichRank: number
}

export interface ISportsCategoryWithID extends ISportsCategory {
    _id: ObjectId
}


export const sportsCategorySchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "shortTitle", "minAdamovichRank", "maxAdamovichRank"],
            additionalProperties: false,
            properties: {
                "_id": {
                    bsonType: "objectId",
                    description: "Поле _id быть ObjectId"
                },
                "title": {
                    bsonType: "string",
                    description: "Поле title является обязательным и должно быть строкой"
                },
                "shortTitle": {
                    bsonType: "string",
                    description: "Поле shortTitle является обязательным и должно быть строкой"
                },
                "minAdamovichRank": {
                    bsonType: "number",
                    description: "Поле minAdamovichRank является обязательным и должно быть числом"
                },
                "maxAdamovichRank": {
                    bsonType: "number",
                    description: "Поле maxAdamovichRank является обязательным и должно быть числом"
                }
            },
        }
    }
}