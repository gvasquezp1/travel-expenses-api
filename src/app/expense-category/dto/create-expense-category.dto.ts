import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateExpenseCategoryDto {
  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  account?: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @IsUUID()
  @IsOptional()
  lineId?: string;

  @IsUUID()
  @IsOptional()
  taxIndicatorId?: string;
}
