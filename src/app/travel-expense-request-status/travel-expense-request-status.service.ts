import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelExpenseRequestStatus } from './entities/travel-expense-request-status.entity';
import { CreateTravelExpenseRequestStatusDto } from './dto/create-travel-expense-request-status.dto';
import { UpdateTravelExpenseRequestStatusDto } from './dto/update-travel-expense-request-status.dto';

@Injectable()
export class TravelExpenseRequestStatusService {
  constructor(
    @InjectRepository(TravelExpenseRequestStatus)
    private readonly repo: Repository<TravelExpenseRequestStatus>,
  ) {}

  create(dto: CreateTravelExpenseRequestStatusDto) {
    const entity = this.repo.create({
      ...dto,
      changedAt: dto.changedAt ? new Date(dto.changedAt) : undefined,
    });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { changedAt: 'DESC', createdAt: 'DESC' } });
  }

  findByRequest(travelExpenseRequestId: string) {
    return this.repo.find({
      where: { travelExpenseRequestId },
      order: { changedAt: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity)
      throw new NotFoundException(
        `Travel expense request status with ID ${id} not found`,
      );
    return entity;
  }

  async update(id: string, dto: UpdateTravelExpenseRequestStatusDto) {
    await this.findOne(id);
    await this.repo.update(id, {
      ...dto,
      changedAt: dto.changedAt ? new Date(dto.changedAt) : undefined,
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
    return { message: 'Travel expense request status deleted successfully' };
  }
}
