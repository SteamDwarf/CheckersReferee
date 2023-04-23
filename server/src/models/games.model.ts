import { ObjectId} from "mongodb";
import { tournamentSchema } from "./tournaments.model";

export enum CheckersColor {
    black = "Черные",
    white = "Белые"
}

export interface IGame {
    tournamentID: string,
    player1ID: string,
    player2ID: string,
    player1Name: string,
    player2Name: string,
    player1Score: number,
    player2Score: number,
    player1CheckersColor: CheckersColor,
    player2CheckersColor: CheckersColor
}
export interface IGameDocumentWithId extends IGame{
    _id: ObjectId,
}

export const Game = (
                tournamentID: string, 
                player1ID: string, 
                player1Name: string, 
                player2ID: string, 
                player2Name: string,
            ):IGame => {
    return {
        tournamentID,
        player1ID,
        player1Name,
        player2ID,
        player2Name,
        player1Score: 0,
        player2Score: 0,
        player1CheckersColor: CheckersColor.black,
        player2CheckersColor: CheckersColor.black
    }
}

export const gamesSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "tournamentID",
                "player1ID", 
                "player2ID", 
                "player1Name", 
                "player2Name", 
                "player1Score", 
                "player2Score",
                "player1CheckersColor",
                "player2CheckersColor"
            ],
            properties: {
                "tournamentID": {
                    bsonType: "string",
                    description: "Поле tournamentID является обязательным и должно быть string"
                },
                "player1ID": {
                    bsonType: "string",
                    description: "Поле player1ID является обязательным и должно быть string"
                },
                "player2ID": {
                    bsonType: "string",
                    description: "Поле player2ID является обязательным и должно быть string"
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
                },
                "player1CheckersColor": {
                    bsonType: "string",
                    description: "Поле player1CheckersColor является обязательным и должно быть строкой"
                },
                "player2CheckersColor": {
                    bsonType: "string",
                    description: "Поле player1CheckersColor является обязательным и должно быть строкой"
                }
            }
        }
    }
}