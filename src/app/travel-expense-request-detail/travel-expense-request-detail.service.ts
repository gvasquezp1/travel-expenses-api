import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelExpenseRequestDetail } from './entities/travel-expense-request-detail.entity';
import { CreateTravelExpenseRequestDetailDto } from './dto/create-travel-expense-request-detail.dto';
import { UpdateTravelExpenseRequestDetailDto } from './dto/update-travel-expense-request-detail.dto';

@Injectable()
export class TravelExpenseRequestDetailService {
  constructor(
    @InjectRepository(TravelExpenseRequestDetail)
    private readonly detailRepo: Repository<TravelExpenseRequestDetail>,
  ) {}

  create(dto: CreateTravelExpenseRequestDetailDto) {
    const detail = this.detailRepo.create(dto);
    return this.detailRepo.save(detail);
  }

  findAll() {
    return this.detailRepo.find({ order: { createdAt: 'DESC' } });
  }

  findByRequest(travelExpenseRequestId: string) {
    return this.detailRepo.find({
      where: { travelExpenseRequestId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    const detail = await this.detailRepo.findOne({ where: { id } });
    if (!detail) throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
    return detail;
  }

  async update(id: string, dto: UpdateTravelExpenseRequestDetailDto) {
    await this.findOne(id);
    await this.detailRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const detail = await this.findOne(id);
    await this.detailRepo.remove(detail);
    return { message: 'Detalle eliminado correctamente' };
  }
}
