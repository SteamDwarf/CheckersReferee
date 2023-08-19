import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ValidationMessages } from "../../common/enums";
import { SportsDesciplines, TournamentSystems } from "../tournaments.model";

class TournamentCreateDTO {
    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    cp: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsIn(Object.values(SportsDesciplines), {message: ValidationMessages.IsIn(Object.values(SportsDesciplines))})
    sportsDescipline: SportsDesciplines;

    @IsOptional()
    @IsArray({message: ValidationMessages.IsArray})
    groups?: (string | undefined)[];

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
    @IsArray({message: ValidationMessages.IsArray})
    coaches?: (string | undefined)[];

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    timeControl?: string;

    @IsOptional()
    @IsNumber({}, {message: ValidationMessages.IsNumber})
    toursCount?: number;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsIn(Object.values(TournamentSystems), {message: ValidationMessages.IsIn(Object.values(TournamentSystems))})
    tournamentSystem: TournamentSystems;

    @IsOptional()
    @IsArray({message: ValidationMessages.IsArray})
    playersIDs?: (string | undefined)[];

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    sportsFacility?: string
}

export default TournamentCreateDTO;