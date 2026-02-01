import { IsBoolean, IsOptional, isString, IsString } from 'class-validator';

export class CreateCostCenterApproverDto {
  @IsString()
  costCenterId: string;

  @IsString()
  approverId: string;

  @IsString()
  approverName: string;

  @IsString()
  approverEmail: string;

  @IsString()
  costCenterName: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
