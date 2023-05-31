import { ObjectId} from "mongodb";

export enum TournamentSystems {
    round = "Круговая",
    swiss = "Швейцарская"
}

export interface ITournament {
    title: string,
    startDate?: string,
    endDate?: string,
    country: string,
    city: string,
    //TODO сделать обязательным
    region?: string,
    isStarted: boolean,
    isFinished: boolean,
    mainReferee: string,
    mainSecretary: string,
    referees: string[] | [],
    timeControl?: string,
    toursCount?: number,
    tournamentSystem: TournamentSystems,
    playersIDs: (string | undefined)[],
    gamesIDs: (string | undefined)[][],
    playersStatsIDs: (string | undefined)[]
}

export interface ITournamentWithId extends ITournament{
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
                "playersIDs", 
                "gamesIDs",
                "playersStatsIDs",
                "tournamentSystem",
            ],
            additionalProperties: false,
            properties: {
                "_id": {
                    bsonType: "objectId",
                    description: "Поле _id быть ObjectId"
                },
                "title": {
                    bsonType: "string",
                    description: "Поле title является обязательным и должно быть строкой"
                },
                "startDate": {
                    bsonType: "string",
                    description: "Поле startDate должно быть строкой"
                },
                "endDate": {
                    bsonType: "string",
                    description: "Поле endDate должно быть строкой"
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
                "playersIDs": {
                    bsonType: "array",
                    description: "Поле playersIDs является обязательным и должно быть массивом"
                },
                "gamesIDs": {
                    bsonType: "array",
                    description: "Поле gamesIDs является обязательным и должно быть массивом"
                },
                "playersStatsIDs": {
                    bsonType: "array",
                    description: "Поле playersStatsIDs является обязательным и должно быть массивом"
                }
            }
        }
    }
}
