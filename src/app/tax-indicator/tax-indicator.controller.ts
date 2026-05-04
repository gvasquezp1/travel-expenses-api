import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaxIndicatorService } from './tax-indicator.service';
import { CreateTaxIndicatorDto } from './dto/create-tax-indicator.dto';
import { UpdateTaxIndicatorDto } from './dto/update-tax-indicator.dto';

@Controller('tax-indicators')
export class TaxIndicatorController {
  constructor(private readonly taxIndicatorService: TaxIndicatorService) {}

  @Post()
  create(@Body() createTaxIndicatorDto: CreateTaxIndicatorDto) {
    return this.taxIndicatorService.create(createTaxIndicatorDto);
  }

  @Get()
  findAll() {
    return this.taxIndicatorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxIndicatorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaxIndicatorDto: UpdateTaxIndicatorDto,
  ) {
    return this.taxIndicatorService.update(id, updateTaxIndicatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxIndicatorService.remove(id);
  }
}
