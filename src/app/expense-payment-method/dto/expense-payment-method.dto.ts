import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateExpensePaymentMethodDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}