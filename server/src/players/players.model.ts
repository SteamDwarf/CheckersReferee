import { ObjectId } from "mongodb"

export enum Gender {
    male = "Мужской",
    female = "Женский"
}

export enum SportsCategoryStatus {
    green = "green",    //Выполнена норма текущего разряда
    gray = "gray",      //Выполнена норма предыдущего разряда
    red = "red"         //Не выполнена норма предыдущего разряда
}

//TODO добавить спортивную школу
export interface IPlayer {
    firstName: string,                  //Имя
    middleName: string,                 //Отчество
    lastName: string,                   //Фамилия
    gender: Gender                      //Пол
    birthday: string,                   //Дата рождения
    region: string,                     //Место проживания
    playerStatsIDs: string[],           //Массив ID документов ститистики игрока в турнирах
    sportsCategoryID: string,           //ID спортивного разряда
    sportsCategoryAbbr: string,         //Краткое название разряда
    //TODO добавить в playerStats 3 поля ниже
    newSportsCategoryID: string,
    newSportsCategoryAbbr: string,
    newSportsCategoryStatus: SportsCategoryStatus,
    sportsOrganization?: string,         //Спортивная организация
    currentAdamovichRank: number,       //Текущий рейтинг Адамовича
    previousAdamovichRank?: number      //Предыдущий рейтинг Адамовича
}

export interface IPlayerWithId extends IPlayer{
    _id: ObjectId,
}

export const playersSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "firstName", 
                "middleName", 
                "lastName",
                "gender",
                "birthday", 
                "region", 
                "sportsCategoryID", 
                "sportsCategoryAbbr",
                "newSportsCategoryID",
                "newSportsCategoryAbbr",
                "newSportsCategoryStatus",
                "currentAdamovichRank",
                "playerStatsIDs"
            ],
            additionalProperties: false,
            properties: {
                "_id": {
                    bsonType: "objectId",
                    description: "Поле _id быть ObjectId"
                },
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
                "gender": {
                    bsonType: "string",
                    description: "Поле gender (пол) является обязательным и должно быть строкой"
                },
                "birthday": {
                    bsonType: "string",
                    description: "Поле birthday (дата рождения) является обязательным и должно быть строкой"
                },
                "region": {
                    bsonType: "string",
                    description: "Поле region (регион) является обязательным и должно быть строкой"
                },
                "currentAdamovichRank": {
                    bsonType: "number",
                    description: "Поле currentAdamovichRank является обязательным и должно быть числом"
                },
                "previousAdamovichRank": {
                    bsonType: "number",
                    description: "Поле previousAdamovichRank должно быть числом"
                },
                "sportsCategoryID": {
                    bsonType: "string",
                    description: "Поле sportsCategoryID (спортивный разряд) является обязательным и должно быть строкой"
                },
                "sportsCategoryAbbr": {
                    bsonType: "string",
                    description: "Поле sportsCategoryAbbr (спортивный разряд краткая форма) является обязательным и должно быть строкой"
                },
                "newSportsCategoryID": {
                    bsonType: "string",
                    description: "Поле newSportsCategoryID (новый спортивный разряд ) является обязательным и должно быть строкой"
                },
                "newSportsCategoryAbbr": {
                    bsonType: "string",
                    description: "Поле newSportsCategoryAbbr (новый спортивный разряд краткая форма ) является обязательным и должно быть строкой"
                },
                "newSportsCategoryStatus": {
                    bsonType: "string",
                    description: "Поле newSportsCategoryStatus (статус нового спортивного разряда ) является обязательным и должно быть строкой"
                },
                "sportsOrganization": {
                    bsonType: "string",
                    description: "Поле sportsOrganization (спортивная организация) должно быть строкой"
                },
                "playerStatsIDs": {
                    bsonType: "array",
                    description: "Поле playerStats (статистика игрока) является обязательным и должно быть массивом"
                },
            },
            
        }
    },
}
