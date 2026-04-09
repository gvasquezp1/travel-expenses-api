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
import { TravelExpenseRequestDetailService } from './travel-expense-request-detail.service';
import { CreateTravelExpenseRequestDetailDto } from './dto/create-travel-expense-request-detail.dto';
import { UpdateTravelExpenseRequestDetailDto } from './dto/update-travel-expense-request-detail.dto';

@Controller('travel-expense-request-details')
export class TravelExpenseRequestDetailController {
  constructor(private readonly detailService: TravelExpenseRequestDetailService) {}

  @Post()
  create(@Body() dto: CreateTravelExpenseRequestDetailDto) {
    return this.detailService.create(dto);
  }

  @Get()
  findAll() {
    return this.detailService.findAll();
  }

  @Get('by-request/:requestId')
  findByRequest(@Param('requestId', new ParseUUIDPipe()) requestId: string) {
    return this.detailService.findByRequest(requestId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.detailService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTravelExpenseRequestDetailDto,
  ) {
    return this.detailService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.detailService.remove(id);
  }
}
