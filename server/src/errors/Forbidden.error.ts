import { ErrorNames } from "./Error.enum";
import { ServerError } from "./Server.error";

export class ForbiddenError extends ServerError {
    constructor(message: string, details?: object | string) {
      super(ErrorNames.FORBIDDEN_ERROR, message, 403, details);
    }
}