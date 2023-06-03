import { IsNotEmpty, MinLength } from "class-validator";


export class CreateUsersDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    is_admin: string;
}