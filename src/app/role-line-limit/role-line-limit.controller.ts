import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoleLineLimitService } from './role-line-limit.service';
import { CreateRoleLineLimitDto } from './dto/create-role-line-limit.dto';
import { UpdateRoleLineLimitDto } from './dto/update-role-line-limit.dto';

@Controller('role-expense-category-limits')
export class RoleLineLimitController {
  constructor(private readonly roleLineLimitService: RoleLineLimitService) {}

  @Post()
  create(@Body() createRoleLineLimitDto: CreateRoleLineLimitDto) {
    return this.roleLineLimitService.create(createRoleLineLimitDto);
  }

  @Get()
  findAll() {
    return this.roleLineLimitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleLineLimitService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleLineLimitDto: UpdateRoleLineLimitDto,
  ) {
    return this.roleLineLimitService.update(id, updateRoleLineLimitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleLineLimitService.remove(id);
  }
}
