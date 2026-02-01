import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelExpenseStatus } from './entities/travel-expense-status.entity';
import { CreateTravelExpenseStatusDto } from './dto/create-travel-expense-status.dto';
import { UpdateTravelExpenseStatusDto } from './dto/update-travel-expense-status.dto';

@Injectable()
export class TravelExpenseStatusService {
  constructor(
    @InjectRepository(TravelExpenseStatus)
    private readonly travelExpenseStatusRepository: Repository<TravelExpenseStatus>,
  ) {}

  async create(createTravelExpenseStatusDto: CreateTravelExpenseStatusDto) {
    const travelExpenseStatus = this.travelExpenseStatusRepository.create(
      createTravelExpenseStatusDto,
    );
    return this.travelExpenseStatusRepository.save(travelExpenseStatus);
  }

  async findAll() {
    return this.travelExpenseStatusRepository.find();
  }

  async findOne(id: string) {
    return this.travelExpenseStatusRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateTravelExpenseStatusDto: UpdateTravelExpenseStatusDto,
  ) {
    await this.travelExpenseStatusRepository.update(
      id,
      updateTravelExpenseStatusDto,
    );
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.travelExpenseStatusRepository.update(id, { locked: true });
    return this.findOne(id);
  }
}
