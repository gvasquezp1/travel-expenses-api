import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateExpensePaymentMethodDto {
  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}