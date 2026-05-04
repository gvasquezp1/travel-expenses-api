import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTravelExpenseDashboardDto {
  @IsString()
  userId: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  year?: number;
}
