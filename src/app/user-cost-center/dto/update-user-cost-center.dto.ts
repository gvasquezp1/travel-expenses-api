import { IsOptional, IsString } from 'class-validator';

export class UpdateUserCostCenterDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  costCenterId?: string;
}
