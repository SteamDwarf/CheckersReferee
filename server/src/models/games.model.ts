import { ObjectId } from "mongodb";

interface IGame {
    player1: ObjectId,
    player1Name: string,
    player2: ObjectId,
    player2Name: string,
    player1Score: number,
    player2Score: number
}

export interface IGameData extends IGame {
    _id: string
}

export interface IGameDocument extends IGame {
    _id: ObjectId
}

const gamesSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["player1", "player2", "player1Name", "player2Name"],
            properties: {
                "player1": {
                    bsonType: "objectId",
                    description: "Поле player1 является обязательным и должно быть objectId"
                },
                "player2": {
                    bsonType: "objectId",
                    description: "Поле player2 является обязательным и должно быть objectId"
                },
                "player1Name": {
                    bsonType: "string",
                    description: "Поле player1Name является обязательным и должно быть строкой"
                },
                "player2Name": {
                    bsonType: "string",
                    description: "Поле player2Name является обязательным и должно быть строкой"
                },
                "playe1Score": {
                    bsonType: "number",
                    description: "Поле playe1Score должно быть числом"
                },
                "playe2Score": {
                    bsonType: "number",
                    description: "Поле playe2Score должно быть числом"
                }
            }
        }
    }
}