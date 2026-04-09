import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TravelExpenseRequestCustomerService } from './travel-expense-request-customer.service';
import { CreateTravelExpenseRequestCustomerDto } from './dto/create-travel-expense-request-customer.dto';
import { UpdateTravelExpenseRequestCustomerDto } from './dto/update-travel-expense-request-customer.dto';

@Controller('travel-expense-request-customers')
export class TravelExpenseRequestCustomerController {
  constructor(private readonly service: TravelExpenseRequestCustomerService) {}

  @Post()
  create(@Body() dto: CreateTravelExpenseRequestCustomerDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('by-request/:requestId')
  findByRequest(@Param('requestId', new ParseUUIDPipe()) requestId: string) {
    return this.service.findByRequest(requestId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTravelExpenseRequestCustomerDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }

  @Delete('by-request/:requestId')
  removeByRequest(@Param('requestId', new ParseUUIDPipe()) requestId: string) {
    return this.service.removeByRequest(requestId);
  }
}
