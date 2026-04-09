import { IsOptional, IsString } from 'class-validator';

export class UpdateBusinessPartnerDto {
  @IsString()
  @IsOptional()
  sapCode?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  customerType?: string;
}
