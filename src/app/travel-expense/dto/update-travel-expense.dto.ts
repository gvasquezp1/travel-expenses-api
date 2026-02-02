import {
  IsString,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTravelExpenseDto } from './create-travel-expense.dto';

export class UpdateTravelExpenseDto extends PartialType(CreateTravelExpenseDto) {}