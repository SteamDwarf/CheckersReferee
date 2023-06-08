export enum CheckersColor {
    black = "Черные",
    white = "Белые"
}

export enum DocumentTemplates {
    RankList = "RankList.html"
}
export enum DocumentCollections{
    PlayerSertificate = "sertificate",
    RankList = "rank-list"
}

export const ValidationMessages = {
    IsNotEmpty: "Поле не должно быть пустым",
    IsEmpty: "Данное поле нельзя изменить",
    IsString: "Поле должно быть строкой",
    IsNumber: "Поле должно быть числом",
    IsArray: "Поле должно быть массивом",
    IsIn: (valuesString: string[]) => `Поле должно иметь одно из следующий значение: ${[...valuesString]}`,
    Min: (num: number) => `Поле должно иметь значение не менее ${num}`,
    Max: (num: number) => `Поле должно иметь значение не более ${num}`
}

export enum CollectionNames {
    PLAYERS = "players",
    USERS = "users",
    SPORTS_CATEGORIES = "sportsCategories",
    TOURNAMENTS = "tournaments",
    GAMES = "games",
    PLAYER_STATS = "playerStats",
    RANK_LISTS = "rankLists"
}

