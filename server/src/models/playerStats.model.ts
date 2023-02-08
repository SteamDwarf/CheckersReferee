import { ObjectId } from "mongodb"

export interface IPlayerStats {
    playerName: string
    tournamentTitle: string,
    tournamentStartDate: Date,
    tournamentEndDate: Date,
    gorinRank: number
    adamovichRank: number,
    place: number
}

export interface IPlayerStatsData extends IPlayerStats {
    player: string,
    tournament: string,
}

export interface IPlayerStatsDocument extends IPlayerStats {
    player: ObjectId,
    tournament: ObjectId,
}

const playerStatsSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["player", "tournament", "playerName", "tournamentTitle", "tournamentStartDate", "tournamentEndDate", "gorinRank", "adamovichRank", "place"],
            properties: {
                "player": {
                    bsonType: "objectId",
                    description: "Поле player является обязательным и должно быть objectId"
                },
                "tournament": {
                    bsonType: "objectId",
                    description: "Поле tournament является обязательным и должно быть objectId"
                },
                "playerName": {
                    bsonType: "string",
                    description: "Поле playerName является обязательным и должно быть строкой"
                },
                "tournamentTitle": {
                    bsonType: "string",
                    description: "Поле tournamentTitle является обязательным и должно быть строкой"
                },
                "tournamentStartDate": {
                    bsonType: "date",
                    description: "Поле tournamentStartDate является обязательным и должно быть датой"
                },
                "tournamentEndDate": {
                    bsonType: "date",
                    description: "Поле tournamentEndDate является обязательным и должно быть датой"
                },
                "gorinRank": {
                    bsonType: "number",
                    description: "Поле gorinRank является обязательным и должно быть числом"
                },
                "adamovichRank": {
                    bsonType: "number",
                    description: "Поле adamovichRank является обязательным и должно быть числом"
                },
                "place": {
                    bsonType: "number",
                    description: "Поле place является обязательным и должно быть числом"
                }
            }
        }
    }
}