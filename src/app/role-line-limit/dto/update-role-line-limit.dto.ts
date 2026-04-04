import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateRoleLineLimitDto {
  @IsString()
  @IsOptional()
  lineId?: string;

  @IsString()
  @IsOptional()
  userRoleId?: string;

  @IsString()
  @IsOptional()
  expenseCategoryId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxAmount?: number;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}
