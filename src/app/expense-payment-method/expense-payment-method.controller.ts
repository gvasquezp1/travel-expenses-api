import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpensePaymentMethodService } from './expense-payment-method.service';
import { CreateExpensePaymentMethodDto } from './dto/create-expense-payment-method.dto';
import { UpdateExpensePaymentMethodDto } from './dto/expense-payment-method.dto';

@Controller('expense-payment-method')
export class ExpensePaymentMethodController {
  constructor(
    private readonly expensePaymentMethodService: ExpensePaymentMethodService,
  ) {}

  @Post()
  create(@Body() createExpensePaymentMethodDto: CreateExpensePaymentMethodDto) {
    return this.expensePaymentMethodService.create(createExpensePaymentMethodDto);
  }

  @Get()
  findAll() {
    return this.expensePaymentMethodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensePaymentMethodService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpensePaymentMethodDto: UpdateExpensePaymentMethodDto,
  ) {
    return this.expensePaymentMethodService.update(
      id,
      updateExpensePaymentMethodDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensePaymentMethodService.remove(id);
  }
}