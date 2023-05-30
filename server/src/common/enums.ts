export enum CheckersColor {
    black = "Черные",
    white = "Белые"
}

export enum DocumentTemplates {
    RankList = "RankList.html"
}

export const ValidationMessages = {
    IsNotEmpty: "Поле не должно быть пустым",
    IsString: "Поле должно быть строкой",
    IsNumber: "Поле должно быть числом",
    IsArray: "Поле должно быть массивом",
    IsIn: (valuesString: string[]) => `Поле должно иметь одно из следующий значение: ${[...valuesString]}`,
    Min: (num: number) => `Поле должно иметь значение не менее ${num}`,
    Max: (num: number) => `Поле должно иметь значение не более ${num}`
}
