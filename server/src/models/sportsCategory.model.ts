import { ObjectId } from "mongodb"
interface ISportsCategory {
    title: string,
    shortTitle: string,
    minAdamovichRank: number,
    maxAdamovichRank: number
}

export interface ISportsCategoryDocument extends ISportsCategory {
    _id: ObjectId
}

export interface ISportsCategoryData extends ISportsCategory {
    _id: string
}

export const sportsCategorySchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "shortTitle", "minAdamovichRank", "maxAdamovichRank"],
            additionalProperties: false,
            properties: {
                "_id": {},
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
            }
        }
    }
}
