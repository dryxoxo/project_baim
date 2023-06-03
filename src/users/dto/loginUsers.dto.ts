import { IsNotEmpty, MinLength } from "class-validator";


export class LoginUsersDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}