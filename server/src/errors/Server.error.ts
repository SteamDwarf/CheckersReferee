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