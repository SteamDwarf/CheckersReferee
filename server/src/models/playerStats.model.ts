import { IPlayerDocumentWithId } from "./players.model"
import { ITournamentDocumentWithId } from "./tournaments.model"
import { getPlayerName } from "../utils/player.utils"
import { ObjectId } from "mongodb"
import { CheckersColor } from "./games.model"

//TODO проверить модель
export interface IPlayerStats {
    playerID: string,
    tournamentId: string,
    playerName: string,
    gorinRank: number
    adamovichRank: number,
    adamovichTimeStamp: string,
    place: number,
    score: number,
    sportsCategory: string,
    requiredScore: number,
    lastCheckersColor: CheckersColor,
    checkersColorUsed: number
}

export interface IPlayerStatsWithID extends IPlayerStats {
    _id: ObjectId
}

export const PlayerStat = (player: IPlayerDocumentWithId, tournamentID: string): IPlayerStats => {
    const playerStat: IPlayerStats = {
        playerID: player._id.toString(),
        playerName: getPlayerName(player),
        tournamentId: tournamentID,
        gorinRank: 0,
        adamovichRank: player.currentAdamovichRank,
        adamovichTimeStamp: Date.now().toLocaleString(),
        place: 0,
        score: 0,
        sportsCategory: player.sportsCategoryID,
        requiredScore: 0,
        lastCheckersColor: CheckersColor.black,
        checkersColorUsed: 0
    }

    return playerStat;
}

export const playerStatsSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "playerID", 
                "tournamentId", 
                "playerName", 
                "gorinRank", 
                "adamovichRank",
                "adamovichTimeStamp",
                "place",
                "score",
                "sportsCategory",
                "requiredScore",
                "lastCheckersColor",
                "checkersColorUsed"
            ],
            properties: {
                "playerID": {
                    bsonType: "string",
                    description: "Поле playerID является обязательным и должно быть строкой"
                },
                "tournamentId": {
                    bsonType: "string",
                    description: "Поле tournamentId является обязательным и должно быть строкой"
                },
                "playerName": {
                    bsonType: "string",
                    description: "Поле playerName является обязательным и должно быть строкой"
                },
                "gorinRank": {
                    bsonType: "number",
                    description: "Поле gorinRank является обязательным и должно быть числом"
                },
                "adamovichRank": {
                    bsonType: "number",
                    description: "Поле adamovichRank является обязательным и должно быть числом"
                },
                "adamovichTimeStamp": {
                    bsonType: "string",
                    description: "Поле adamovichTimeStamp является обязательным и должно быть строкой"
                },
                "place": {
                    bsonType: "number",
                    description: "Поле place является обязательным и должно быть числом"
                },
                "score": {
                    bsonType: "number",
                    description: "Поле score является обязательным и должно быть числом"
                },
                "sportsCategory": {
                    bsonType: "string",
                    description: "Поле sportsCategory является обязательным и должно быть строкой"
                },
                "requiredScore": {
                    bsonType: "number",
                    description: "Поле requiredScore является обязательным и должно быть числом"
                },
                "lastCheckersColor": {
                    bsonType: "string",
                    description: "Поле lastCheckersColor является обязательным должно быть строкой"
                },
                "checkersColorUsed": {
                    bsonType: "number",
                    description: "Поле checkersColorUsed является обязательным должно быть числом"
                },
            }
        }
    }
}