import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateTravelExpenseStatusDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}
