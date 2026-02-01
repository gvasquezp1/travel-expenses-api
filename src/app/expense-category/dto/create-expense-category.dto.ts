import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateExpenseCategoryDto {
  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}