import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TravelExpenseRequestService } from './travel-expense-request.service';
import { CreateTravelExpenseRequestDto } from './dto/create-travel-expense-request.dto';
import { UpdateTravelExpenseRequestDto } from './dto/update-travel-expense-request.dto';

@Controller('travel-expense-requests')
export class TravelExpenseRequestController {
  constructor(private readonly service: TravelExpenseRequestService) {}

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
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
}
