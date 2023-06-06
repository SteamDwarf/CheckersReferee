import { IsArray, IsEmpty, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ValidationMessages } from "../../common/enums";
import { TournamentSystems } from "../tournaments.model";

class TournamentCreateDTO {
    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    title: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    startDate?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    endDate?: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    country: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    city: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    region?: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    mainReferee: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    mainSecretary: string;

    @IsOptional()
    @IsArray({message: ValidationMessages.IsArray})
    referees?: (string | undefined)[];

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    timeControl?: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsIn(Object.values(TournamentSystems), {message: ValidationMessages.IsIn(Object.values(TournamentSystems))})
    tournamentSystem: TournamentSystems;

    @IsOptional()
    @IsArray({message: ValidationMessages.IsArray})
    playersIDs?: (string | undefined)[];
}

export default TournamentCreateDTO;