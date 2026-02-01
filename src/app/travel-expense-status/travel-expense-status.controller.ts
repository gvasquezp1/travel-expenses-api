import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TravelExpenseStatusService } from './travel-expense-status.service';
import { CreateTravelExpenseStatusDto } from './dto/create-travel-expense-status.dto';
import { UpdateTravelExpenseStatusDto } from './dto/update-travel-expense-status.dto';

@Controller('travel-expense-status')
export class TravelExpenseStatusController {
  constructor(
    private readonly travelExpenseStatusService: TravelExpenseStatusService,
  ) {}

  @Post()
  create(@Body() createTravelExpenseStatusDto: CreateTravelExpenseStatusDto) {
    return this.travelExpenseStatusService.create(createTravelExpenseStatusDto);
  }

  @Get()
  findAll() {
    return this.travelExpenseStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.travelExpenseStatusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTravelExpenseStatusDto: UpdateTravelExpenseStatusDto,
  ) {
    return this.travelExpenseStatusService.update(
      id,
      updateTravelExpenseStatusDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.travelExpenseStatusService.remove(id);
  }
}
