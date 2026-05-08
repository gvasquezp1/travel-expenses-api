import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateTravelExpenseLegalizationDto {
  @IsOptional()
  @IsUUID()
  travelExpenseRequestId?: string;

  @IsOptional()
  @IsUUID()
  travelExpenseRequestDetailId?: string;

  @IsInt()
  @Min(1)
  dayNumber: number;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @IsOptional()
  supplierNit?: string;

  @IsString()
  @IsNotEmpty()
  supplierName: string;

  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsDecimal()
  @IsNotEmpty()
  invoiceAmount: number;

  @IsOptional()
  @IsUUID()
  taxIndicatorId?: string;

  @IsDecimal()
  @IsOptional()
  taxAmount?: number;

  @IsDecimal()
  @IsOptional()
  tipAmount?: number;

  @IsDecimal()
  @IsOptional()
  consumptionTaxAmount?: number;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsDecimal()
  @IsOptional()
  amountApproved?: number;

  @IsDecimal()
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  urlPath?: string;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;

  @IsString()
  @IsOptional()
  approvedBy?: string;

  @IsDateString()
  @IsOptional()
  approvedAt?: Date;
}
