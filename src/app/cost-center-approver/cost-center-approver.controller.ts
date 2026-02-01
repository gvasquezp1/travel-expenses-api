import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCostCenterApproverDto } from './dto/create-cost-center-approver';
import { CostCenterApproverService } from './services/cost-center-approver.service';
import { UpdateCostCenterApproverDto } from './dto/update-cost-center-approver';

@Controller('cost-centers-approvers')
export class CostCentersController {
  constructor(private readonly service: CostCenterApproverService) {}

  @Post()
  create(@Body() dto: CreateCostCenterApproverDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCostCenterApproverDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
