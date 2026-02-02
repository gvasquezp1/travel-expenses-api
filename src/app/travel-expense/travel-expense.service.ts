import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelExpense } from './entities/travel-expense.entity';
import { CreateTravelExpenseDto } from './dto/create-travel-expense.dto';
import { UpdateTravelExpenseDto } from './dto/update-travel-expense.dto';

@Injectable()
export class TravelExpenseService {
  constructor(
    @InjectRepository(TravelExpense)
    private travelExpenseRepository: Repository<TravelExpense>,
  ) {}

  async create(createTravelExpenseDto: CreateTravelExpenseDto) {
    const travelExpense = this.travelExpenseRepository.create(createTravelExpenseDto);
    return await this.travelExpenseRepository.save(travelExpense);
  }

  async findAll() {
    return await this.travelExpenseRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const travelExpense = await this.travelExpenseRepository.findOne({
      where: { id },
    });
    if (!travelExpense) {
      throw new NotFoundException(`Travel Expense with ID ${id} not found`);
    }
    return travelExpense;
  }

  async update(id: string, updateTravelExpenseDto: UpdateTravelExpenseDto) {
    await this.findOne(id);
    await this.travelExpenseRepository.update(id, updateTravelExpenseDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const travelExpense = await this.findOne(id);
    return await this.travelExpenseRepository.remove(travelExpense);
  }
}