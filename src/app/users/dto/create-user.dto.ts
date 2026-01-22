import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    role: string;

    @IsString()
    phoneNumber: string;

    @IsString()
    costCenter: string;

    @MinLength(6)
    password: string;
}
