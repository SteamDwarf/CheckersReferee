import { ObjectId, WithId } from "mongodb";

interface IGame {
    player1Name: string,
    player2Name: string,
    player1Score: number,
    player2Score: number
}

export interface IGameData extends IGame {
    player1Id: string,
    player2Id: string,
}

export interface IGameDocument extends IGame {
    player1Id: ObjectId,
    player2Id: ObjectId,
}
export interface IGameDocumentWithId extends IGameDocument, WithId<Document>{
    _id: ObjectId,
}

export const Game = (player1Id: ObjectId, player1Name: string, player2Id: ObjectId, player2Name: string):IGameDocument => {
    return {
        player1Id,
        player1Name,
        player2Id,
        player2Name,
        player1Score: 0,
        player2Score: 0
    }
}

const gamesSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["player1Id", "player2Id", "player1Name", "player2Name", "player1Score", "player2Score"],
            properties: {
                "player1Id": {
                    bsonType: "objectId",
                    description: "Поле player1Id является обязательным и должно быть objectId"
                },
                "player2Id": {
                    bsonType: "objectId",
                    description: "Поле player2Id является обязательным и должно быть objectId"
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
                    description: "Поле playe1Score является обязательным и должно быть числом"
                },
                "playe2Score": {
                    bsonType: "number",
                    description: "Поле playe2Score является обязательным и должно быть числом"
                }
            }
        }
    }
}