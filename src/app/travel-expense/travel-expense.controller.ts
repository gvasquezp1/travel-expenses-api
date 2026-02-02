import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TravelExpenseService } from './travel-expense.service';
import { CreateTravelExpenseDto } from './dto/create-travel-expense.dto';
import { UpdateTravelExpenseDto } from './dto/update-travel-expense.dto';

@Controller('travel-expenses')
export class TravelExpenseController {
  constructor(private readonly travelExpenseService: TravelExpenseService) {}

  @Post()
  create(@Body() createTravelExpenseDto: CreateTravelExpenseDto) {
    return this.travelExpenseService.create(createTravelExpenseDto);
  }

  @Get()
  findAll() {
    return this.travelExpenseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.travelExpenseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTravelExpenseDto: UpdateTravelExpenseDto,
  ) {
    return this.travelExpenseService.update(id, updateTravelExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.travelExpenseService.remove(id);
  }
}