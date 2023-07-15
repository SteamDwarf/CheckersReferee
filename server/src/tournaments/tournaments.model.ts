import { ObjectId} from "mongodb";

export enum TournamentSystems {
    round = "Круговая",
    swiss = "Швейцарская"
}

export enum SportsDesciplines {
    RussianCheckers = "русские шашки",
    RussianCheckers_FastGame = "русские шашки - быстрая игра",
    RussianCheckers_FastGame_TeamCompetition = "русские шашки - командные соревнования",
    RussianCheckers_LightningGame = "русские шашки - молниеносная игра",
    RussianCheckers_LightningGame_TeamCompetition = "русские шашки - молниеносная игра - командные соревнования",
    StandingCheckers = "стоклеточные шашки",
    StandingCheckers_FastGame = "стоклеточные шашки - быстрая игра",
    StandingCheckers_FastGame_TeamCompetition = "стоклеточные шашки - быстрая игра - командные соревнования",
    StandingCheckers_TeamCompetition = "стоклеточные шашки - командные соревнования",
    StandingCheckers_LightningGame = "стоклеточные шашки - молниеносная игра",
    StandingCheckers_LightningGame_TeamCompetition = "стоклеточные шашки - молниеносная игра - командные соревнования",
    CorrespondenceCheckers = "игра по переписке",
    Giveaway = "обратная игра в шашки (поддавки)",
    CheckersComposition = "шашечная композиция",
    Renju = "рэндзю"
}


//TODO добавить помещение
//TODO добавить количество зрителей
//TODO оценка служебных помещений состояния и оснащения служебных помещений
//TODO оценка качества проведения соревнований
//TODO оценка размещения, питания, транспортного обслуживания, организации встреч и проводов спортивных делегаций, шефская работа и т.п.:
//TODO оценка встречи спортсменов
//TODO оценка соблюдения мер по обеспечению безопасности
export interface ITournament {
    cp: string,
    title: string,
    sportsDescipline: SportsDesciplines,
    groups: (string | undefined)[],
    startDate?: string,
    endDate?: string,
    country: string,
    city: string,
    region?: string,
    isStarted: boolean,
    isFinished: boolean,
    mainReferee: string,
    mainSecretary: string,
    referees: (string | undefined)[],
    //TODO может надо будет указывать только количество
    coaches: (string | undefined)[],
    timeControl?: string,
    toursCount: number,
    currentTour: number,
    tournamentSystem: TournamentSystems,
    playersIDs: (string | undefined)[],
    gamesIDs: (string | undefined)[][],
    playersStatsIDs: (string | undefined)[],
    sportsFacility?: string
}

export interface ITournamentWithId extends ITournament{
    _id: ObjectId,
}


export const tournamentSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "cp",
                "title",
                "sportsDescipline",
                "groups",
                "country",
                "city",
                "isStarted", 
                "isFinished", 
                "toursCount",
                "currentTour",
                "mainReferee", 
                "mainSecretary",
                "referees",
                "coaches",
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
                "cp": {
                    bsonType: "string",
                    description: "Поле cp является обязательным и должно быть строкой"
                },
                "sportsDescipline": {
                    bsonType: "string",
                    description: "Поле sportsDescipline является обязательным и должно быть строкой"
                },
                "groups": {
                    bsonType: "array",
                    description: "Поле groups является обязательным и должно быть массивом"
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
                "coaches": {
                    bsonType: "array",
                    description: "Поле coaches является обязательным должно быть массивом"
                },
                "timeControl": {
                    bsonType: "string",
                    description: "Поле timeControl должно быть строкой"
                },
                "toursCount": {
                    bsonType: "number",
                    description: "Поле toursCount является обязательным и должно быть числом"
                },
                "currentTour": {
                    bsonType: "number",
                    description: "Поле currentTour является обязательным и должно быть числом"
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
                },
                "sportsFacility": {
                    bsonType: "string",
                    description: "Поле sportsFacility должно быть строкой"
                }
            }
        }
    }
}
