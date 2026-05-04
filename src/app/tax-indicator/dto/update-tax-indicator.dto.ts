import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxIndicatorDto } from './create-tax-indicator.dto';

export class UpdateTaxIndicatorDto extends PartialType(CreateTaxIndicatorDto) {}
