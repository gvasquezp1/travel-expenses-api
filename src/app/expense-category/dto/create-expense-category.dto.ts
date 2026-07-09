import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateExpenseCategoryDto {
  @IsString()
  description: string;

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
