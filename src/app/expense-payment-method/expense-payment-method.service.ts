import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpensePaymentMethod } from './entities/expense-payment-method.entity';
import { CreateExpensePaymentMethodDto } from './dto/create-expense-payment-method.dto';
import { UpdateExpensePaymentMethodDto } from './dto/expense-payment-method.dto';

@Injectable()
export class ExpensePaymentMethodService {
  constructor(
    @InjectRepository(ExpensePaymentMethod)
    private readonly expensePaymentMethodRepository: Repository<ExpensePaymentMethod>,
  ) {}

  async create(createExpensePaymentMethodDto: CreateExpensePaymentMethodDto) {
    const expensePaymentMethod = this.expensePaymentMethodRepository.create(
      createExpensePaymentMethodDto,
    );
    return this.expensePaymentMethodRepository.save(expensePaymentMethod);
  }

  async findAll() {
    return this.expensePaymentMethodRepository.find();
  }

  async findOne(id: string) {
    return this.expensePaymentMethodRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateExpensePaymentMethodDto: UpdateExpensePaymentMethodDto,
  ) {
    await this.expensePaymentMethodRepository.update(
      id,
      updateExpensePaymentMethodDto,
    );
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.expensePaymentMethodRepository.update(id, { locked: true });
    return this.findOne(id);
  }
}