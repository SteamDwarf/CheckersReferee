import { ObjectId } from "mongodb"

export enum Gender {
    male = "Мужской",
    female = "Женский"
}
//TODO разобраться текцщим и предыдущим рейтингом
export interface IPlayer {
    firstName: string,                  //Имя
    middleName: string,                 //Отчество
    lastName: string,                   //Фамилия
    gender: Gender                      //Пол
    birthday: string,                   //Дата рождения
    region: string,                     //Место проживания
    sportsCategoryID: string,           //ID спортивного разряда
    playerStatsIDs: string[],      //Массив ID документов ститистики игрока в турнирах
    sportsCategoryAbbr: string,         //Краткое название разряда
    sportsOrganization: string,         //Спортивная организация
    currentAdamovichRank: number,       //Текущий рейтинг Адамовича
    previousAdamovichRank?: number      //Предыдущий рейтинг Адамовича
}

export interface IPlayerDocumentWithId extends IPlayer{
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
                "sportsOrganization",
                "currentAdamovichRank",
                "playerStatsIDs"
            ],
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
                "sportsOrganization": {
                    bsonType: "string",
                    description: "Поле sportsOrganization (спортивная организация) является обязательным и должно быть строкой"
                },
                "playerStatsIDs": {
                    bsonType: "array",
                    description: "Поле playerStats (статистика игрока) является обязательным и должно быть массивом"
                },
            }
        }
    }
}
