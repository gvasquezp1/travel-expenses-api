import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { LineRequestLimitService } from './line-request-limit.service';
import { CreateLineRequestLimitDto } from './dto/create-line-request-limit.dto';
import { UpdateLineRequestLimitDto } from './dto/update-line-request-limit.dto';

@Controller('line-request-limits')
export class LineRequestLimitController {
  constructor(private readonly lineRequestLimitService: LineRequestLimitService) {}

  @Post()
  create(@Body() createLineRequestLimitDto: CreateLineRequestLimitDto) {
    return this.lineRequestLimitService.create(createLineRequestLimitDto);
  }

  @Get()
  findAll() {
    return this.lineRequestLimitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lineRequestLimitService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateLineRequestLimitDto: UpdateLineRequestLimitDto,
  ) {
    return this.lineRequestLimitService.update(id, updateLineRequestLimitDto);
  }

  @Patch(':id')
  patch(
    @Param('id') id: string,
    @Body() updateLineRequestLimitDto: UpdateLineRequestLimitDto,
  ) {
    return this.lineRequestLimitService.update(id, updateLineRequestLimitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lineRequestLimitService.remove(id);
  }
}
