import { ErrorNames } from "./Error.enum";
import { ServerError } from "./Server.error";

class ValidationError extends ServerError {
    constructor(message: string, details?: object | string | object[]) {
        super(ErrorNames.VALIDATE_ERROR, message, 400, details);
    }
}

export default ValidationError;