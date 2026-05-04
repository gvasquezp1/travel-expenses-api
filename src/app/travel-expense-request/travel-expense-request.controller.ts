import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import type { Response as ExpressResponse } from 'express';
import { TravelExpenseRequestService } from './travel-expense-request.service';
import { TravelExpenseRequestExcelService } from './travel-expense-request-excel.service';
import { CreateTravelExpenseRequestDto } from './dto/create-travel-expense-request.dto';
import { UpdateTravelExpenseRequestDto } from './dto/update-travel-expense-request.dto';
import { GenerateTreasuryFileDto } from './dto/generate-treasury-file.dto';

@Controller('travel-expense-requests')
export class TravelExpenseRequestController {
  constructor(
    private readonly service: TravelExpenseRequestService,
    private readonly excelService: TravelExpenseRequestExcelService,
  ) {}

  @Post()
  create(@Body() createDto: CreateTravelExpenseRequestDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('requested-for/:userId')
  findByRequestedForUser(@Param('userId') userId: string) {
    return this.service.findByRequestedForUser(userId);
  }

  @Get('created-by/:userId')
  findByCreatedBy(@Param('userId') userId: string) {
    return this.service.findByCreatedBy(userId);
  }

  @Get('cost-center/:costCenterId')
  findByCostCenter(@Param('costCenterId') costCenterId: string) {
    return this.service.findByCostCenter(costCenterId);
  }

  @Get('approver/:approverId')
  findByApprover(@Param('approverId', new ParseUUIDPipe()) approverId: string) {
    return this.service.findByApprover(approverId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/excel')
  async downloadExcel(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: ExpressResponse,
  ) {
    const buffer = await this.excelService.generateExcel(id);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="anticipo-viaticos-${id}.xlsx"`);
    res.end(buffer);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTravelExpenseRequestDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Patch(':id/lock')
  lock(@Param('id') id: string) {
    return this.service.lock(id);
  }

  @Patch(':id/unlock')
  unlock(@Param('id') id: string) {
    return this.service.unlock(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('generate-treasury-file')
  async generateTreasuryFile(
    @Body() dto: GenerateTreasuryFileDto,
    @Res() res: ExpressResponse,
  ) {
    const fileContent = await this.service.generateTreasuryFlatFile(dto.documentNumbers);
    
    // Generar nombre de archivo con fecha actual
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const filename = `treasury-file-${dateStr}.txt`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(fileContent);
  }
}
