import { ObjectId, WithId } from "mongodb";

interface IGame {
    player1Name?: string,
    player2Name?: string,
    player1Score: number,
    player2Score: number
}

export interface IGameData extends IGame {
    player1Id?: string,
    player2Id?: string,
}

export interface IGameDocument extends IGame {
    player1Id: ObjectId,
    player2Id: ObjectId,
}
export interface IGameDocumentWithId extends IGameDocument, WithId<Document>{
    _id: ObjectId,
}

export const Game = (player1Id?: string, player1Name?: string, player2Id?: string, player2Name?: string):IGameData => {
    return {
        player1Id,
        player1Name,
        player2Id,
        player2Name,
        player1Score: 0,
        player2Score: 0
    }
}

//TODO добавить в БД
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