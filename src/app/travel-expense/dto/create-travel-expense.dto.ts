import {
  IsString,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateTravelExpenseDto {
  @IsString()
  userEmail: string;

  @IsString()
  userName: string;

  @IsString()
  reason: string;

  @IsDateString()
  docDate: string;

  @IsString()
  originCountry: string;

  @IsString()
  originCity: string;

  @IsString()
  destinationCountry: string;

  @IsString()
  destinationCity: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  categoryName: string;

  @IsUUID()
  statusId: string;

  @IsString()
  statusName: string;

  @IsString()
  centerCode: string;

  @IsString()
  centerName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  @IsOptional()
  taxes?: number;

  @IsNumber()
  @IsOptional()
  tips?: number;

  @IsString()
  paymentMethod: string;

  @IsBoolean()
  @IsOptional()
  refundable?: boolean;

  @IsString()
  @IsOptional()
  supplierId?: string;

  @IsString()
  @IsOptional()
  supplierName?: string;

  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsString()
  @IsOptional()
  file1?: string;

  @IsString()
  @IsOptional()
  file2?: string;

  @IsString()
  @IsOptional()
  file3?: string;

  @IsString()
  @IsOptional()
  rejectedReason?: string;

  @IsUUID()
  createdBy: string;

  @IsString()
  @IsOptional()
  createdByEmail?: string;

    @IsString()
  @IsOptional()
  createdByName?: string;


  @IsUUID()
  @IsOptional()
  editedBy?: string;

@IsString()
  @IsOptional()
  editedByName?: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}