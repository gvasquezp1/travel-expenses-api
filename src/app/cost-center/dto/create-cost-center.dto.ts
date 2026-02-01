import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Length,
  Min,
} from 'class-validator';

export class CreateCostCenterDto {
  @IsString()
  @Length(1, 120)
  centerCode: string;

  @IsString()
  @Length(1, 255)
  description: string;

  // @IsNumber()
  // @Min(0)
  // budget: number;

  // @IsNumber()
  // @Min(0)
  // spent: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
