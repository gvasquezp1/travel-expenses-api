import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Controller('role-permissions')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  create(@Body() dto: CreateRolePermissionDto) {
    return this.rolePermissionService.create(dto);
  }

  @Get()
  findAll(@Query('roleId') roleId?: string) {
    // Si se proporciona roleId como query param, filtrar por rol
    console.log('Query param roleId:', roleId);
    if (roleId) {
      return this.rolePermissionService.findByRole(roleId);
    }
    return this.rolePermissionService.findAll();
  }

  @Get('by-role/:roleId')
  findByRole(@Param('roleId', new ParseUUIDPipe()) roleId: string) {
    return this.rolePermissionService.findByRole(roleId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.rolePermissionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateRolePermissionDto,
  ) {
    return this.rolePermissionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.rolePermissionService.remove(id);
  }
}