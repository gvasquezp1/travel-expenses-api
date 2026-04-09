import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsOptional()
  from?: string;
}
