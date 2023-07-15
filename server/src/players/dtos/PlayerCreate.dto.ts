import {IsString, IsIn, IsNotEmpty, IsOptional, IsNumber, Min} from "class-validator";
import { Gender } from "../players.model";
import { ValidationMessages } from "../../common/enums";

class PlayerCreateDTO {
    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    firstName: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    middleName?: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    lastName: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsIn(Object.values(Gender), {message: ValidationMessages.IsIn(Object.values(Gender))})
    gender: Gender;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    birthday: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    region: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    sportsCategoryID: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    sportsOrganization?: string;

    @IsOptional()
    @IsNumber({}, {message: ValidationMessages.IsNumber})
    @Min(255, {message: ValidationMessages.Min(255)})
    currentAdamovichRank?: number;
}

export default PlayerCreateDTO;