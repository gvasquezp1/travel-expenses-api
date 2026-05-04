import { IsUUID, IsString, IsDate, IsDecimal, IsOptional, IsNotEmpty, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTravelExpenseRequestDto {
  @IsUUID()
  @IsNotEmpty()
  requestedForUserId: string;

  @IsString()
  @IsNotEmpty()
  requestedForUserName: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  docDate: Date;

  @IsString()
  @IsNotEmpty()
  originCountry: string;

  @IsString()
  @IsNotEmpty()
  originCity: string;

  @IsString()
  @IsNotEmpty()
  destinationCountry: string;

  @IsString()
  @IsNotEmpty()
  destinationCity: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsUUID()
  @IsNotEmpty()
  costCenterId: string;

  @IsString()
  @IsNotEmpty()
  costCenterName: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsUUID()
  @IsNotEmpty()
  paymentMethodId: string;
  
  @IsString()
  @IsNotEmpty()
paymentMethodName: string;
  

  @IsUUID()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  createdByName: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  numberOfDays?: number;

  @IsBoolean()
  @IsOptional()
  cashWithdrawal?: boolean;
}
