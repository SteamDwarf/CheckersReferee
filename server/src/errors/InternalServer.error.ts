import { ErrorNames } from "./Error.enum";
import { ServerError } from "./Server.error";

export class InternalServerError extends ServerError {
    constructor(details?: object | string) {
      super(ErrorNames.SERVER_ERROR, "Внутренняя ошибка сервера", 500, details);
    }
}