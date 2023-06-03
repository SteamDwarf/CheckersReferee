import { ObjectId} from "mongodb";
import { CheckersColor } from "../common/enums";

export interface IGame {
    tournamentID: string,
    player1StatsID: string,
    player2StatsID: string,
    player1Name: string,
    player2Name: string,
    player1Score: number,
    player2Score: number,
    player1CheckersColor: CheckersColor,
    player2CheckersColor: CheckersColor
}
export interface IGameWithId extends IGame{
    _id: ObjectId,
}

//TODO удалить
export const Game = (
                tournamentID: string, 
                player1StatsID: string, 
                player1Name: string, 
                player2StatsID: string, 
                player2Name: string,
                player1CheckersColor?: CheckersColor,
                player2CheckersColor?: CheckersColor
            ):IGame => {
    return {
        tournamentID,
        player1StatsID,
        player1Name,
        player2StatsID,
        player2Name,
        player1Score: 0,
        player2Score: 0,
        player1CheckersColor: player1CheckersColor || CheckersColor.black,
        player2CheckersColor: player2CheckersColor || CheckersColor.black
    }
}

export const gamesSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "tournamentID",
                "player1StatsID", 
                "player2StatsID", 
                "player1Name", 
                "player2Name", 
                "player1Score", 
                "player2Score",
                "player1CheckersColor",
                "player2CheckersColor"
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
                "player1StatsID": {
                    bsonType: "string",
                    description: "Поле player1ID является обязательным и должно быть string"
                },
                "player2StatsID": {
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
                "player1Score": {
                    bsonType: "number",
                    description: "Поле playe1Score является обязательным и должно быть числом"
                },
                "player2Score": {
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