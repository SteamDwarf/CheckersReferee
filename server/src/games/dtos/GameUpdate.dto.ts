import { IsEmpty, IsNotEmpty, Max, Min } from "class-validator"
import { CheckersColor, ValidationMessages } from "../../common/enums"

class GameUpdateDTO {
    @IsEmpty({message: ValidationMessages.IsEmpty})
    _id?: string;

    @IsEmpty({message: ValidationMessages.IsEmpty})
    tournamentID?: string;

    @IsEmpty({message: ValidationMessages.IsEmpty})
    player1StatsID?: string;

    @IsEmpty({message: ValidationMessages.IsEmpty})
    player2StatsID?: string;

    @IsEmpty({message: ValidationMessages.IsEmpty})
    player1Name?: string;

    @IsEmpty({message: ValidationMessages.IsEmpty})
    player2Name?: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @Min(0, {message: ValidationMessages.Min(0)})
    @Max(2, {message: ValidationMessages.Max(2)})
    player1Score: number;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @Min(0, {message: ValidationMessages.Min(0)})
    @Max(2, {message: ValidationMessages.Max(2)})
    player2Score: number;

    @IsEmpty({message: ValidationMessages.IsEmpty})
    player1CheckersColor?: CheckersColor;

    @IsEmpty({message: ValidationMessages.IsEmpty})
    player2CheckersColor?: CheckersColor;
}

export default GameUpdateDTO;