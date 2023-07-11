import { NextFunction, Request, Response } from "express";
import { IMiddleware } from "./interfaces";
import { ClassConstructor, plainToInstance} from "class-transformer";
import { validate } from "class-validator";
import ValidationError from "../errors/Validation.error";

class ValidateMiddleware implements IMiddleware {
    private readonly _classToValidate: ClassConstructor<object>;

    constructor(classToValidate: ClassConstructor<object>) {
        this._classToValidate = classToValidate;
    }

    public async execute(request: Request, response: Response, next: NextFunction) {
        const inst = plainToInstance(this._classToValidate, request.body);
        const errors = await validate(inst);

        if(errors.length > 0) {
            return next(new ValidationError("Неверно указаны поля", errors));
        }

        next();
    }
}

export default ValidateMiddleware;