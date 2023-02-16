import { ObjectId } from "mongodb"
import { IPlayerDocument, IPlayerDocumentWithId } from "./players.model"
import { ITournamentDocument, ITournamentDocumentWithId } from "./tournaments.model"
import { getPlayerName } from "../utils/player.utils"

export interface IPlayerStats {
    playerName: string
    tournamentTitle: string,
    tournamentStartDate?: Date,
    tournamentEndDate?: Date,
    gorinRank: number
    adamovichRank: number,
    place: number,
    score: number
}

export interface IPlayerStatsData extends IPlayerStats {
    playerId: string,
    tournamentId: string,
}

export interface IPlayerStatsDocument extends IPlayerStats {
    playerId: ObjectId,
    tournamentId: ObjectId,
}

export const PlayerStat = (player: IPlayerDocumentWithId, tournament: ITournamentDocumentWithId): IPlayerStatsDocument => {
    const playerStat: IPlayerStatsDocument = {
        playerId: player._id,
        playerName: getPlayerName(player),
        tournamentId: tournament._id,
        tournamentTitle: tournament.title,
        gorinRank: 0,
        adamovichRank: player.currentAdamovichRank,
        place: 0,
        score: 0
    }

    tournament.startDate ? playerStat.tournamentStartDate = tournament.startDate : null;
    tournament.endDate ? playerStat.tournamentEndDate = tournament.endDate : null;

    return playerStat;
}

const playerStatsSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "playerId", 
                "tournamentId", 
                "playerName", 
                "tournamentTitle", 
                "gorinRank", 
                "adamovichRank", 
                "place",
                "score"
            ],
            properties: {
                "playerId": {
                    bsonType: "objectId",
                    description: "Поле playerId является обязательным и должно быть objectId"
                },
                "tournamentId": {
                    bsonType: "objectId",
                    description: "Поле tournamentId является обязательным и должно быть objectId"
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
                    description: "Поле tournamentStartDate должно быть датой"
                },
                "tournamentEndDate": {
                    bsonType: "date",
                    description: "Поле tournamentEndDate должно быть датой"
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
                },
                "score": {
                    bsonType: "number",
                    description: "Поле score является обязательным и должно быть числом"
                }
            }
        }
    }
}