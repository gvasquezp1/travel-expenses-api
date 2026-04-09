import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTravelExpenseRequestCustomerDto {
  @IsUUID()
  @IsNotEmpty()
  travelExpenseRequestId: string;

  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  sapCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
