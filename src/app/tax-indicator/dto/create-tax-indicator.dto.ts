import { IsString, IsBoolean, IsOptional, Length } from 'class-validator';

export class CreateTaxIndicatorDto {
  @IsString()
  @Length(1, 120)
  code: string;

  @IsString()
  @Length(1, 255)
  description: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
