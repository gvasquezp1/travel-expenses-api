import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRoleLineLimitDto {
  @IsString()
  lineId: string;

  @IsString()
  userRoleId: string;

  @IsString()
  expenseCategoryId: string;

  @IsNumber()
  @Min(0)
  maxAmount: number;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}
