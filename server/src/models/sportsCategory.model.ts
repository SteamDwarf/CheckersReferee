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

const sportsCategory = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "shortTitle", "minAdamovichRank", "maxAdamovichRank"],
            properties: {
                "title": {
                    bsonType: "string",
                    description: "Поле categoryName является обязательным и должно быть строкой"
                },
                "shortTitle": {
                    bsonType: "string",
                    description: "Поле shortName является обязательным и должно быть строкой"
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
