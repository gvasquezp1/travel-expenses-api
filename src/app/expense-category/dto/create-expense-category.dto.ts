import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateExpenseCategoryDto {
  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  account?: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}