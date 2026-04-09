import { PartialType } from '@nestjs/mapped-types';
import { CreateTravelExpenseLegalizationDto } from './create-travel-expense-legalization.dto';

export class UpdateTravelExpenseLegalizationDto extends PartialType(
  CreateTravelExpenseLegalizationDto,
) {}
