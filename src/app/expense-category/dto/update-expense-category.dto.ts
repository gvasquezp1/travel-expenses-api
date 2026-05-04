import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class UpdateExpenseCategoryDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @IsString()
  @IsOptional()
  account?: string;

  @IsUUID()
  @IsOptional()
  lineId?: string;

  @IsUUID()
  @IsOptional()
  taxIndicatorId?: string;
}
