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

export enum SportCategories {
    GR = "Гроссмейстер России",
    MS = "Мастер спорта",
    CMS = "Кандидат в мастера спорта",
    I = "I разряд",
    II = "II разряд",
    III = "III разряд",
    Iy = "I юношеский разряд",
    IIy = "II юношеский разряд",
    IIIy = "III юношеский разряд",
    UD = "Без разряда"
}

export enum SportCategoriesAbbr {
    GR = "ГР",
    MS = "МС",
    CMS = "КМС",
    I = "I",
    II = "II",
    III = "III",
    Iy = "I юн.",
    IIy = "II юн.",
    IIIy = "III юн.",
    UD = "БР"
}
