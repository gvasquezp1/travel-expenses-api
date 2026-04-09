import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelExpenseLegalization } from './entities/travel-expense-legalization.entity';
import { CreateTravelExpenseLegalizationDto } from './dto/create-travel-expense-legalization.dto';
import { UpdateTravelExpenseLegalizationDto } from './dto/update-travel-expense-legalization.dto';

@Injectable()
export class TravelExpenseLegalizationService {
  constructor(
    @InjectRepository(TravelExpenseLegalization)
    private readonly repo: Repository<TravelExpenseLegalization>,
  ) {}

  create(dto: CreateTravelExpenseLegalizationDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findByRequest(travelExpenseRequestId: string) {
    return this.repo.find({
      where: { travelExpenseRequestId },
      order: { dayNumber: 'ASC', createdAt: 'ASC' },
    });
  }

  findByDetail(travelExpenseRequestDetailId: string) {
    return this.repo.find({
      where: { travelExpenseRequestDetailId },
      order: { dayNumber: 'ASC' },
    });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity)
      throw new NotFoundException(`Travel expense legalization ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateTravelExpenseLegalizationDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
    return { message: 'Legalization deleted successfully' };
  }

  async removeByRequest(travelExpenseRequestId: string) {
    const items = await this.repo.find({ where: { travelExpenseRequestId } });
    if (!items.length)
      return { message: 'No legalizations found for this request', deleted: 0 };
    await this.repo.remove(items);
    return { message: 'Legalizations deleted successfully', deleted: items.length };
  }
}
