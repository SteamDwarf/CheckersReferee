import { Db } from "mongodb"

const sportsCategory = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "shortTitle"],
            properties: {
                "title": {
                    bsonType: "string",
                    description: "Поле categoryName является обязательным и должно быть строкой"
                },
                "shortTitle": {
                    bsonType: "string",
                    description: "Поле shortName является обязательным и должно быть строкой"
                }
            }
        }
    }
}
