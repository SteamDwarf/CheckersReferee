import { IPlayerWithId } from "../players/players.model"
import { getPlayerName } from "../utils/player.utils"
import { ObjectId } from "mongodb"
import { CheckersColor } from "../models/games.model"

export interface IPlayerStats {
    playerID: string,
    tournamentID: string,
    playerName: string,
    birthday: string,
    gorinRank: number
    startAdamovichRank: number,
    lastAdamovichRank: number,
    startAdamovichTimeStamp: number,
    lastAdamovichTimeStamp: number,
    place: number,
    score: number,
    sportsCategoryID: string,
    requiredScore: number,
    colorUsed: number,
    lastColor: CheckersColor,
    competitorsID: (string | undefined)[]
}

export interface IPlayerStatsWithID extends IPlayerStats {
    _id: ObjectId
}

export const PlayerStat = (player: IPlayerWithId, tournamentID: string): IPlayerStats => {
    const playerStat: IPlayerStats = {
        playerID: player._id.toString(),
        playerName: getPlayerName(player),
        birthday: player.birthday,
        tournamentID: tournamentID,
        gorinRank: 0,
        startAdamovichRank: player.currentAdamovichRank,
        lastAdamovichRank: player.currentAdamovichRank,
        startAdamovichTimeStamp: Date.now(),
        lastAdamovichTimeStamp: Date.now(),
        place: 0,
        score: 0,
        requiredScore: 0,
        colorUsed: 0,
        lastColor: CheckersColor.black,
        sportsCategoryID: player.sportsCategoryID,
        competitorsID: []
    }

    return playerStat;
}

export const playerStatsSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "playerID", 
                "tournamentID", 
                "playerName", 
                "birthday",
                "gorinRank", 
                "startAdamovichRank",
                "lastAdamovichRank",
                "startAdamovichTimeStamp",
                "lastAdamovichTimeStamp",
                "place",
                "score",
                "sportsCategoryID",
                "requiredScore",
                "colorUsed",
                "lastColor"
            ],
            additionalProperties: false,
            properties: {
                "_id": {
                    bsonType: "objectId",
                    description: "Поле _id быть ObjectId"
                },
                "playerID": {
                    bsonType: "string",
                    description: "Поле playerID является обязательным и должно быть строкой"
                },
                "tournamentID": {
                    bsonType: "string",
                    description: "Поле tournamentID является обязательным и должно быть строкой"
                },
                "playerName": {
                    bsonType: "string",
                    description: "Поле playerName является обязательным и должно быть строкой"
                },
                "birthday": {
                    bsonType: "string",
                    description: "Поле birthday является обязательным и должно быть строкой"
                },
                "gorinRank": {
                    bsonType: "number",
                    description: "Поле gorinRank является обязательным и должно быть числом"
                },
                "startAdamovichRank": {
                    bsonType: "number",
                    description: "Поле startAdamovichRank является обязательным и должно быть числом"
                },
                "startAdamovichTimeStamp": {
                    bsonType: "number",
                    description: "Поле startAdamovichTimeStamp является обязательным и должно быть числом"
                },
                "lastAdamovichRank": {
                    bsonType: "number",
                    description: "Поле startAdamovichRank является обязательным и должно быть числом"
                },
                "lastAdamovichTimeStamp": {
                    bsonType: "number",
                    description: "Поле startAdamovichTimeStamp является обязательным и должно быть числом"
                },
                "place": {
                    bsonType: "number",
                    description: "Поле place является обязательным и должно быть числом"
                },
                "score": {
                    bsonType: "number",
                    description: "Поле score является обязательным и должно быть числом"
                },
                "colorUsed": {
                    bsonType: "number",
                    description: "Поле colorUsed является обязательным и должно быть числом"
                },
                "lastColor": {
                    bsonType: "string",
                    description: "Поле lastColor является обязательным и должно быть строкой 'Черные' или 'Белые'"
                },
                "requiredScore": {
                    bsonType: "number",
                    description: "Поле requiredScore является обязательным и должно быть числом"
                },
                "sportsCategoryID": {
                    bsonType: "string",
                    description: "Поле sportCategoryID является обязательным и должно быть строкой"
                },
                "competitorsID": {
                    bsonType: "array",
                    description: "Поле competitorsID является обязательным и должно быть массивом"
                }
            }
        }
    }
}