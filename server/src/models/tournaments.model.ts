import { ObjectId, WithId } from "mongodb";
import { IGameData } from "./games.model";

interface ITournament {
    title: string,
    startDate?: Date,
    endDate?: Date,
    country: string,
    city: string,
    region?: string,
    isStarted: boolean,
    isFinished: boolean,
    mainReferee: string,
    mainSecretary: string,
    referees: string[] | [],
    timeControl?: string,
    toursCount?: number,
    tournamentSystem: string,
    drawType?: string,
}

export interface ITournamentData extends ITournament {
    _id: string,
    players: string[] | [],
    games: (string | undefined)[],
}
export interface ITournamentDocument extends ITournament {
    players: ObjectId[] | [],
    games: (ObjectId | undefined)[]
}

export interface ITournamentDocumentWithId extends ITournamentDocument{
    _id: ObjectId,
}


export const tournamentSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "title",
                "country",
                "city",
                "isStarted", 
                "isFinished", 
                "mainReferee", 
                "mainSecretary",
                "referees",
                "players", 
                "games",
                "tournamentSystem",
            ],
            properties: {
                "title": {
                    bsonType: "string",
                    description: "Поле title является обязательным и должно быть строкой"
                },
                "startDate": {
                    bsonType: "date",
                    description: "Поле startDate должно быть датой"
                },
                "endDate": {
                    bsonType: "date",
                    description: "Поле endDate должно быть датой"
                },
                "country": {
                    bsonType: "string",
                    description: "Поле country является обязательным и должно быть строкой"
                },
                "city": {
                    bsonType: "string",
                    description: "Поле city является обязательным и должно быть строкой"
                },
                "region": {
                    bsonType: "string",
                    description: "Поле region должно быть строкой"
                },
                "isStarted": {
                    bsonType: "bool",
                    description: "Поле isStarted является обязательным и должно быть логическим"
                },
                "isFinished": {
                    bsonType: "bool",
                    description: "Поле isFinished является обязательным и должно быть логическим"
                },
                "mainReferee": {
                    bsonType: "string",
                    description: "Поле mainReferee является обязательным и должно быть строкой"
                },
                "mainSecretary": {
                    bsonType: "string",
                    description: "Поле mainSecretary является обязательным и должно быть строкой"
                },
                "referees": {
                    bsonType: "array",
                    description: "Поле referees является обязательным должно быть массивом"
                },
                "timeControl": {
                    bsonType: "string",
                    description: "Поле timeControl должно быть строкой"
                },
                "toursCount": {
                    bsonType: "number",
                    description: "Поле toursCount должно быть числом"
                },
                "tournamentSystem": {
                    bsonType: "string",
                    description: "Поле tournamentSystem является обязательным должно быть строкой"
                },
                "drawType": {
                    bsonType: "string",
                    description: "Поле drawType должно быть строкой"
                },
                "players": {
                    bsonType: "array",
                    description: "Поле players является обязательным и должно быть массивом"
                },
                "games": {
                    bsonType: "array",
                    description: "Поле games является обязательным и должно быть массивом"
                }
            }
        }
    }
}
