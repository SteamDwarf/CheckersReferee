import { IsArray, IsBoolean, IsEmpty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { SportsDesciplines, TournamentSystems } from "../tournaments.model";
import { ValidationMessages } from "../../common/enums";

class TournamentUpdateDTO {
    @IsEmpty({message: ValidationMessages.IsEmpty})
    _id?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    cp?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    title?: string;

    @IsOptional()
    @IsIn(Object.values(SportsDesciplines), {message: ValidationMessages.IsIn(Object.values(SportsDesciplines))})
    sportsDescipline?: SportsDesciplines;

    @IsOptional()
    @IsArray({message: ValidationMessages.IsArray})
    groups?: (string | undefined)[];

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    startDate?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    endDate?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    country?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    city?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    region?: string;

    //TODO после тестов расскомментировать
    /* @IsEmpty({message: ValidationMessages.IsEmpty})
    isStarted?: boolean;

    @IsEmpty({message: ValidationMessages.IsEmpty})
    isFinished?: boolean; */

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    mainReferee?: string;

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    mainSecretary?: string;

    @IsOptional()
    @IsArray({message: ValidationMessages.IsArray})
    referees?: (string | undefined)[];

    @IsOptional()
    @IsArray({message: ValidationMessages.IsArray})
    coaches?: (string | undefined)[];

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    timeControl?: string;

    @IsEmpty({message: ValidationMessages.IsEmpty})
    toursCount?: number;

    //TODO расскомментировать
    //@IsEmpty({message: ValidationMessages.IsEmpty})
    @IsOptional()
    @IsNumber({}, {message: ValidationMessages.IsNumber})
    currentTour?: number;

    @IsOptional()
    @IsIn(Object.values(TournamentSystems), {message: ValidationMessages.IsIn(Object.values(TournamentSystems))})
    tournamentSystem?: TournamentSystems;

    @IsOptional()
    @IsArray({message: ValidationMessages.IsArray})
    playersIDs?: (string | undefined)[];

    //TODO после тестов расскомментировать
    /* @IsEmpty({message: ValidationMessages.IsEmpty})
    gamesIDs?: (string | undefined)[][];
    
    @IsEmpty({message: ValidationMessages.IsEmpty})
    playersStatsIDs?: (string | undefined)[]; */

    @IsOptional()
    @IsString({message: ValidationMessages.IsString})
    sportsFacility?: string
}

export default TournamentUpdateDTO;