import { PartialType } from '@nestjs/mapped-types';
import { CreateCostCenterApproverDto } from './create-cost-center-approver';

export class UpdateCostCenterApproverDto extends PartialType(
  CreateCostCenterApproverDto,
) {}
