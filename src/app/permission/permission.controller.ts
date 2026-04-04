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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get('by-module/:moduleId')
  findByModule(@Param('moduleId', new ParseUUIDPipe()) moduleId: string) {
    return this.permissionService.findByModule(moduleId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.permissionService.remove(id);
  }
}
