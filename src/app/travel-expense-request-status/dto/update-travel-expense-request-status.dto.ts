import { PartialType } from '@nestjs/mapped-types';
import { CreateTravelExpenseRequestStatusDto } from './create-travel-expense-request-status.dto';

export class UpdateTravelExpenseRequestStatusDto extends PartialType(
  CreateTravelExpenseRequestStatusDto,
) {}
