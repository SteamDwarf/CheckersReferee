import { CheckersColor } from "../common/enums"
import { ObjectId } from "mongodb"

export interface IPlayerStats {
    playerID: string,
    tournamentID: string,
    playerName: string,
    birthday: string,
    region: string,
    gorinRank: number
    startAdamovichRank: number,
    lastAdamovichRank: number,
    startAdamovichTimeStamp: number,
    lastAdamovichTimeStamp: number,
    place: number,
    score: number,
    sportsCategoryID: string,
    sportsCategoryAbbr: string,
    requiredScore: number,
    colorUsed: number,
    lastColor: CheckersColor,
    competitorsID: (string | undefined)[]
}

export interface IPlayerStatsWithID extends IPlayerStats {
    _id: ObjectId
}

export interface IPlayerStatsSearchFilter {
    tournamentID?: string, 
    playerID?: string
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
                "region",
                "gorinRank", 
                "startAdamovichRank",
                "lastAdamovichRank",
                "startAdamovichTimeStamp",
                "lastAdamovichTimeStamp",
                "place",
                "score",
                "sportsCategoryID",
                "sportsCategoryAbbr",
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
                "region": {
                    bsonType: "string",
                    description: "Поле region является обязательным и должно быть строкой"
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
                "sportsCategoryAbbr": {
                    bsonType: "string",
                    description: "Поле sportsCategoryAbbr является обязательным и должно быть строкой"
                },
                "competitorsID": {
                    bsonType: "array",
                    description: "Поле competitorsID является обязательным и должно быть массивом"
                }
            }
        }
    }
}