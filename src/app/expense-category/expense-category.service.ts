import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseCategory } from './entities/expense-category.entity';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';

@Injectable()
export class ExpenseCategoryService {
  constructor(
    @InjectRepository(ExpenseCategory)
    private readonly expenseCategoryRepository: Repository<ExpenseCategory>,
  ) {}

  async create(createExpenseCategoryDto: CreateExpenseCategoryDto) {
    const expenseCategory = this.expenseCategoryRepository.create(
      createExpenseCategoryDto,
    );
    return this.expenseCategoryRepository.save(expenseCategory);
  }

  async findAll() {
    return this.expenseCategoryRepository.find();
  }

  async findOne(id: string) {
    return this.expenseCategoryRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateExpenseCategoryDto: UpdateExpenseCategoryDto,
  ) {
    await this.expenseCategoryRepository.update(
      id,
      updateExpenseCategoryDto,
    );
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.expenseCategoryRepository.update(id, { locked: true });
    return this.findOne(id);
  }
}