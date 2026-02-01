import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpenseCategoryService } from './expense-category.service';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';

@Controller('expense-category')
export class ExpenseCategoryController {
  constructor(
    private readonly expenseCategoryService: ExpenseCategoryService,
  ) {}

  @Post()
  create(@Body() createExpenseCategoryDto: CreateExpenseCategoryDto) {
    return this.expenseCategoryService.create(createExpenseCategoryDto);
  }

  @Get()
  findAll() {
    return this.expenseCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto,
  ) {
    return this.expenseCategoryService.update(
      id,
      updateExpenseCategoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseCategoryService.remove(id);
  }
}