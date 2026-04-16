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
import { TravelExpenseLegalizationService } from './travel-expense-legalization.service';
import { CreateTravelExpenseLegalizationDto } from './dto/create-travel-expense-legalization.dto';
import { UpdateTravelExpenseLegalizationDto } from './dto/update-travel-expense-legalization.dto';

@Controller('travel-expense-legalizations')
export class TravelExpenseLegalizationController {
  constructor(private readonly service: TravelExpenseLegalizationService) {}

  @Post()
  create(@Body() dto: CreateTravelExpenseLegalizationDto) {
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

  @Get('by-detail/:detailId')
  findByDetail(@Param('detailId', new ParseUUIDPipe()) detailId: string) {
    return this.service.findByDetail(detailId);
  }

  @Get('independent')
  findIndependent() {
    return this.service.findIndependent();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTravelExpenseLegalizationDto,
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
