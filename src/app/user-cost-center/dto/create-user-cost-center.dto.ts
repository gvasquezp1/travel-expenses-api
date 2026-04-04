import { IsString } from 'class-validator';

export class CreateUserCostCenterDto {
  @IsString()
  userId: string;

  @IsString()
  costCenterId: string;
}
