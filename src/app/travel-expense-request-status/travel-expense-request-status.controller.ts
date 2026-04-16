import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TravelExpenseRequestStatusService } from './travel-expense-request-status.service';
import { CreateTravelExpenseRequestStatusDto } from './dto/create-travel-expense-request-status.dto';
import { UpdateTravelExpenseRequestStatusDto } from './dto/update-travel-expense-request-status.dto';

@Controller('travel-expense-request-status')
export class TravelExpenseRequestStatusController {
  constructor(private readonly service: TravelExpenseRequestStatusService) {}

  @Post()
  create(@Body() dto: CreateTravelExpenseRequestStatusDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('by-request/:travelExpenseRequestId')
  findByRequest(
    @Param('travelExpenseRequestId', new ParseUUIDPipe())
    travelExpenseRequestId: string,
  ) {
    return this.service.findByRequest(travelExpenseRequestId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTravelExpenseRequestStatusDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
