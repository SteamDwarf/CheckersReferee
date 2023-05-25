import { ErrorNames } from "./Error.enum";
import { ServerError } from "./Server.error";

export class InputError extends ServerError {
    constructor(message: string, details?: object | string) {
      super(ErrorNames.INPUT_ERROR, message, 400, details);
    }
  }