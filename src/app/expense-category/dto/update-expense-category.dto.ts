import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateExpenseCategoryDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}