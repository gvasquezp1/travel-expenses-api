import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateTravelExpenseRequestDetailDto {
  @IsUUID()
  travelExpenseRequestId: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amountRequested: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  categoryLimit: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  amountSubmitted?: number;

  @IsBoolean()
  @IsOptional()
  approved?: boolean;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  amountApproved?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  balance?: number;
}
