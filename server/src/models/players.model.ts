import { ObjectId, WithId } from "mongodb"
import { ISportsCategoryData } from "./sportsCategory.model"


export interface IPlayer {
    firstName: string,                  //Имя
    middleName: string,                 //Отчество
    lastName: string,                   //Фамилия
    birthday: Date,                     //Дата рождения
    region: string,                     //Место проживания
    sportsCategoryAbbr: string,         //Краткое название разряда
    sportsOrganization: string,         //Спортивная организация
    currentAdamovichRank: number,       //Текущий рейтинг Адамовича
    previousAdamovichRank?: number      //Предыдущий рейтинг Адамовича
}

export interface IPlayerData extends IPlayer {
    sportsCategory: string,             //ID спортивного разряда
    playerStats?: string[] | []         //Массив ID статистики игрока в турнирах
}

export interface IPlayerDocument extends IPlayer{
    sportsCategory: ObjectId,
    playerStats?: ObjectId[] | []
}
export interface IPlayerDocumentWithId extends IPlayerDocument, WithId<Document>{
    _id: ObjectId,
}

const playersSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "firstName", 
                "middleName", 
                "lastName", 
                "birthday", 
                "region", 
                "sportsCategory", 
                "sportsCategoryAbbr",
                "sportsOrganization",
                "currentAdamovichRank"
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
                "birthday": {
                    bsonType: "date",
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
                "sportsCategory": {
                    bsonType: "objectId",
                    description: "Поле sportsCategory (спортивный разряд) является обязательным и должно быть objectId"
                },
                "sportsCategoryAbbr": {
                    bsonType: "string",
                    description: "Поле sportsCategoryAbbr (спортивный разряд краткая форма) является обязательным и должно быть строкой"
                },
                "sportsOrganization": {
                    bsonType: "string",
                    description: "Поле sportsOrganization (спортивная организация) является обязательным и должно быть строкой"
                },
                "playerStats": {
                    bsonType: "array",
                    description: "Поле playerStats (статистика игрока) должно быть массивом"
                },
            }
        }
    }
}
