import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTravelExpenseRequestStatusDto {
  @IsUUID()
  @IsNotEmpty()
  travelExpenseRequestId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDateString()
  @IsOptional()
  changedAt?: string;
}
