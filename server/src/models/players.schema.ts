import { ObjectId } from "mongodb";

const playersSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [],
            properties: {
                "firstname": {
                    bsonType: "string",
                },
                "middlename": {
                    bsonType: "string",
                },
                "lastname": {
                    bsonType: "string",
                },
                "birthday": {
                    bsonType: "date",
                },
                "currentAdamovichRank": {
                    bsonType: "double"
                },
                "gorinRank": {
                    bsonType: "int"
                },
                "sportsCategory": {
                    bsonType: "objectId"
                },
                "sportsTite": {
                    bsonType: "string"
                },
                "allAdamovichRatinks": {
                    bsonType: "object",
                    properties: {
                        "tournament": {
                            bsonType: "objectId"
                        },
                        "tournamentTitle": {
                            bsonType: "string"
                        },
                        "tournamentStartDate": {
                            bsonType: "date"
                        },
                        "tournamentEndDate": {
                            bsonType: "date"
                        },
                        "adamovichRank": {
                            bsonType: "double"
                        }
                    }
                }

            }
        }
    }
}