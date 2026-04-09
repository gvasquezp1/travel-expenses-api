import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBusinessPartnerDto {
  @IsString()
  @IsNotEmpty()
  sapCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  customerType: string;
}
