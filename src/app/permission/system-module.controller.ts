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
import { SystemModuleService } from './system-module.service';
import { PermissionSeedService } from './permission-seed.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Controller('modules')
export class SystemModuleController {
  constructor(
    private readonly moduleService: SystemModuleService,
    private readonly seedService: PermissionSeedService,
  ) {}

  @Post('seed')
  seed() {
    return this.seedService.seed();
  }

  @Post()
  create(@Body() dto: CreateModuleDto) {
    return this.moduleService.create(dto);
  }

  @Get()
  findAll() {
    return this.moduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.moduleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateModuleDto,
  ) {
    return this.moduleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.moduleService.remove(id);
  }
}
