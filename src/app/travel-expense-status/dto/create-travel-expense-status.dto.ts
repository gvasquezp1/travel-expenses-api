import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTravelExpenseStatusDto {
  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}
