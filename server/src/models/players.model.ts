import { ObjectId } from "mongodb"

export interface IPlayer {
    firstName: string,
    middleName: string,
    lastName: string,
    birthday: Date,
    region: string,
    currentAdamovichRank?: number,
    previousAdamovichRank?: number,
    gorinRank?: number,
    allAdamovichRanks?: string
}

export interface IPlayerData extends IPlayer {
    sportsCategory: string,
}

export interface IPlayerDocument extends IPlayer{
    sportsCategory: ObjectId
}

const playersSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["firstName", "middleName", "lastName", "birthday", "region", "sportsCategory"],
            properties: {
                "firstName": {
                    bsonType: "string",
                    description: "Поле firstName (имя) является обязательным и должно быть строкой"
                },
                "middleName": {
                    bsonType: "string",
                    description: "Поле middleName (отчество) является обязательным и должно быть строкой"
                },
                "lastName": {
                    bsonType: "string",
                    description: "Поле lastName (фамилия) является обязательным и должно быть строкой"
                },
                "birthday": {
                    bsonType: "date",
                    description: "Поле birthday (дата рождения) является обязательным и должно быть строкой"
                },
                "region": {
                    bsonType: "string",
                    description: "Поле region (регион) является обязательным и должно быть строкой"
                },
                "currentAdamovichRank": {
                    bsonType: "double"
                },
                "previousAdamovichRank": {
                    bsonType: "double"
                },
                "gorinRank": {
                    bsonType: "int"
                },
                "sportsCategory": {
                    bsonType: "objectId",
                    description: "Поле sportsCategory (спортивный разряд) является обязательным и должно быть строкой"
                },
                "allAdamovichRanks": {
                    bsonType: "objectId",
                }

            }
        }
    }
}
