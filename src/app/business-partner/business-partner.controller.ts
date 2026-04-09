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
import { BusinessPartnerService } from './business-partner.service';
import { CreateBusinessPartnerDto } from './dto/create-business-partner.dto';
import { UpdateBusinessPartnerDto } from './dto/update-business-partner.dto';
import { BulkUpsertBusinessPartnerDto } from './dto/bulk-upsert-business-partner.dto';

@Controller('business-partners')
export class BusinessPartnerController {
  constructor(private readonly businessPartnerService: BusinessPartnerService) {}

  @Post()
  create(@Body() dto: CreateBusinessPartnerDto) {
    return this.businessPartnerService.create(dto);
  }

  @Post('bulk-upsert')
  upsertBulk(@Body() dto: BulkUpsertBusinessPartnerDto) {
    return this.businessPartnerService.upsertBulk(dto);
  }

  @Get()
  findAll() {
    return this.businessPartnerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.businessPartnerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBusinessPartnerDto,
  ) {
    return this.businessPartnerService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.businessPartnerService.remove(id);
  }
}
