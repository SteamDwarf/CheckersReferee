import { ObjectId } from "mongodb";
import { UserRoles } from "../users.model";
import { IsNotEmpty, IsString } from "class-validator";
import { ValidationMessages } from "../../common/enums";

class UserAuthDTO {
    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    login: string;

    @IsNotEmpty({message: ValidationMessages.IsNotEmpty})
    @IsString({message: ValidationMessages.IsString})
    password: string;
}

export default UserAuthDTO;