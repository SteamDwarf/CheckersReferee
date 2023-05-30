import { IsArray, IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ValidationMessages } from "../../common/enums";
import { Gender } from "../players.model";

class PlayerUpdateDTO {
    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    firstName?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    middleName?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    lastName?: string;

    @IsOptional()
    @IsIn(Object.values(Gender), {message: ValidationMessages.IsIn(Object.values(Gender))})
    gender?: Gender;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    birthday?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    region?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    sportsCategoryID?: string;

    @IsOptional()
    @IsArray({message: ValidationMessages.IsArray})
    playerStatsIDs?: string[];

    @IsOptional()
    @IsString()
    sportsCategoryAbbr?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    sportsOrganization?: string;

    @IsOptional()
    @IsNumber({}, {message: ValidationMessages.IsNumber})
    @Min(255, {message: ValidationMessages.Min(255)})
    currentAdamovichRank?: number;

    @IsOptional()
    @IsNumber({}, {message: ValidationMessages.IsNumber})
    @Min(255, {message: ValidationMessages.Min(255)})
    previousAdamovichRank?: number;
}

export default PlayerUpdateDTO;