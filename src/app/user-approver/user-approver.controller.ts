import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserApproverService } from './services/user-approver.service';
import { CreateUserApproverDto } from './dto/create-user-approver.dto';
import { UpdateUserApproverDto } from './dto/update-user-approver.dto';

@Controller('user-approvers')
export class UserApproverController {
  constructor(private readonly service: UserApproverService) {}

  @Post()
  create(@Body() dto: CreateUserApproverDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.service.findByUserId(userId);
  }

  @Get('is-approver/:userId')
  isApprover(@Param('userId') userId: string) {
    return this.service.isApprover(userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserApproverDto) {
    return this.service.update(id, dto);
  }

  @Delete('user/:userId')
  removeByUserId(@Param('userId') userId: string) {
    return this.service.removeByUserId(userId);
  }
}
