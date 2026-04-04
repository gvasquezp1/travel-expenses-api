import { PartialType } from '@nestjs/mapped-types';
import { CreateTravelExpenseRequestDto } from './create-travel-expense-request.dto';

export class UpdateTravelExpenseRequestDto extends PartialType(CreateTravelExpenseRequestDto) {}
