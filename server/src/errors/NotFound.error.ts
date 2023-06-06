import { ErrorNames } from "./Error.enum";
import { ServerError } from "./Server.error";

export class NotFoundError extends ServerError {
    constructor(message: string, details?: object | string) {
      super(ErrorNames.NOT_FOUND_ERROR, message, 404, details);
    }
  }
  