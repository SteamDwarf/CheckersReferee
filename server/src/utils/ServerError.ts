export enum ErrorNames {
  VALIDATION_ERROR = "Ошибка проверки данных",
  INPUT_ERROR = "Ошибка ввода данных",
  NOT_FOUND_ERROR = "Данные не найдены",
  SERVER_ERROR = "Ошибка сервера",
  AUTH_ERROR = "Ошибка авторизации"
}

export class ServerError extends Error {
  public readonly message: string;
  public readonly status?: number;
  public readonly details?: object | string;

  constructor(name: string, message: string, status?: number, details?: object | string) {
    super();

    this.name = name;
    this.message = message;
    this.status = status;
    this.details = details;

    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends ServerError {
  constructor(message: string, details?: object | string) {
    super(ErrorNames.NOT_FOUND_ERROR, message, 404, details);
  }
}

export class InputError extends ServerError {
  constructor(message: string, details?: object | string) {
    super(ErrorNames.INPUT_ERROR, message, 400, details);
  }
}

export class AuthError extends ServerError {
  constructor(message: string, details?: object | string) {
    super(ErrorNames.AUTH_ERROR, message, 400, details);
  }
}

export class InternalServerError extends ServerError {
  constructor(details?: object | string) {
    super(ErrorNames.SERVER_ERROR, "Внутренняя ошибка сервера", 500, details);
  }
}


export class DataBaseError extends ServerError {
  constructor(details?: object | string) {
    super(ErrorNames.VALIDATION_ERROR, "Документ не прошел проверку. Некорректный тип данных", 400, details);
  }
}
