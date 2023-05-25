import { ErrorNames } from "./Error.enum";
import { ServerError } from "./Server.error";

export class AuthError extends ServerError {
    constructor(message: string, details?: object | string) {
      super(ErrorNames.AUTH_ERROR, message, 400, details);
    }
}