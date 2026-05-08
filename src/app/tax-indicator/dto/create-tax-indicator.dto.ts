import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateTaxIndicatorDto {
  @IsString()
  @Length(1, 120)
  code: string;

  @IsString()
  @Length(1, 255)
  description: string;

  @IsOptional()
  @IsUUID()
  lineId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
