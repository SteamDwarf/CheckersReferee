import { IPlayerDocumentWithId } from "./players.model"
import { ITournamentDocumentWithId } from "./tournaments.model"
import { getPlayerName } from "../utils/player.utils"
import { ObjectId } from "mongodb"
import { CheckersColor } from "./games.model"

export interface IPlayerStats {
    playerID: string,
    tournamentID: string,
    playerName: string,
    gorinRank: number
    startAdamovichRank: number,
    lastAdamovichRank: number,
    startAdamovichTimeStamp: number,
    lastAdamovichTimeStamp: number,
    place: number,
    score: number,
    sportsCategory: string,
    requiredScore: number,
}

export interface IPlayerStatsWithID extends IPlayerStats {
    _id: ObjectId
}

export const PlayerStat = (player: IPlayerDocumentWithId, tournamentID: string): IPlayerStats => {
    const playerStat: IPlayerStats = {
        playerID: player._id.toString(),
        playerName: getPlayerName(player),
        tournamentID: tournamentID,
        gorinRank: 0,
        startAdamovichRank: player.currentAdamovichRank,
        lastAdamovichRank: player.currentAdamovichRank,
        startAdamovichTimeStamp: Date.now(),
        lastAdamovichTimeStamp: Date.now(),
        place: 0,
        score: 0,
        sportsCategory: player.sportsCategoryID,
        requiredScore: 0
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
                "gorinRank", 
                "startAdamovichRank",
                "lastAdamovichRank",
                "startAdamovichTimeStamp",
                "lastAdamovichTimeStamp",
                "place",
                "score",
                "sportsCategory",
                "requiredScore"
            ],
            properties: {
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
                "sportsCategory": {
                    bsonType: "string",
                    description: "Поле sportsCategory является обязательным и должно быть строкой"
                },
                "requiredScore": {
                    bsonType: "number",
                    description: "Поле requiredScore является обязательным и должно быть числом"
                }
            }
        }
    }
}