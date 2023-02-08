import { ObjectId } from "mongodb";

interface ITournament {
    title: string,
    startDate?: Date,
    endDate?: Date,
    region?: string,
    isStarted: boolean,
    isFinished: boolean,
    mainReferee: string,
    mainSecretary: string
}

export interface ITournamentData extends ITournament {
    players: string[] | [],
    games: string[] | [],

}
export interface ITournamentDocument extends ITournament {
    players: ObjectId[] | [],
    games: ObjectId[] | [],
    
}


const tournamentSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "isStarted", "isFinished", "mainReferee", "mainSecretary", "players", "games"],
            properties: {
                "title": {
                    bsonType: "string",
                    description: "Поле title является обязательным и должно быть строкой"
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
                "players": {
                    bsonType: "array",
                    description: "Поле players является обязательным и должно быть массивом"
                },
                "games": {
                    bsonType: "array",
                    description: "Поле games является обязательным и должно быть массивом"
                },
                "startDate": {
                    bsonType: "date",
                    description: "Поле startDate должно быть датой"
                },
                "endDate": {
                    bsonType: "date",
                    description: "Поле endDate должно быть датой"
                },
                "region": {
                    bsonType: "string",
                    description: "Поле region должно быть строкой"
                }
            }
        }
    }
}
