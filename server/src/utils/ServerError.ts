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

export class DataBaseError extends ServerError {
  constructor(details?: object | string) {
    super("Ошибка проверки данных", "Документ не прошел проверку. Некорректный тип данных", 400, details);
  }
}
