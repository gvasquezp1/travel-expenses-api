import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserCostCenterService } from './services/user-cost-center.service';
import { CreateUserCostCenterDto } from './dto/create-user-cost-center.dto';
import { UpdateUserCostCenterDto } from './dto/update-user-cost-center.dto';

@Controller('user-cost-centers')
export class UserCostCenterController {
  constructor(private readonly service: UserCostCenterService) {}

  @Post()
  create(@Body() dto: CreateUserCostCenterDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.service.findByUserId(userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserCostCenterDto) {
    return this.service.update(id, dto);
  }

  @Delete('user/:userId')
  removeByUserId(@Param('userId') userId: string) {
    return this.service.removeByUserId(userId);
  }
}
