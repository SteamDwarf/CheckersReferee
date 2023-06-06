import { ErrorNames } from "./Error.enum";
import { ServerError } from "./Server.error";

export class DataBaseError extends ServerError {
    constructor(details?: object | string) {
      super(ErrorNames.VALIDATION_ERROR, "Документ не прошел проверку. Некорректный тип данных", 400, details);
    }
}