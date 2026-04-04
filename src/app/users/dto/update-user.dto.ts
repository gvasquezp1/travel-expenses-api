import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phoneNumber?: string;
  @IsOptional() @IsString() lineId?: string;
  @IsOptional() @IsString() roleId?: string;
  @IsOptional() @IsBoolean() locked?: boolean;
}
