import { PartialType } from '@nestjs/mapped-types';
import { CreateTravelExpenseRequestCustomerDto } from './create-travel-expense-request-customer.dto';

export class UpdateTravelExpenseRequestCustomerDto extends PartialType(
  CreateTravelExpenseRequestCustomerDto,
) {}
