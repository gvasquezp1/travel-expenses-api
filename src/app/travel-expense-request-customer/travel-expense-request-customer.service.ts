import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelExpenseRequestCustomer } from './entities/travel-expense-request-customer.entity';
import { CreateTravelExpenseRequestCustomerDto } from './dto/create-travel-expense-request-customer.dto';
import { UpdateTravelExpenseRequestCustomerDto } from './dto/update-travel-expense-request-customer.dto';

@Injectable()
export class TravelExpenseRequestCustomerService {
  constructor(
    @InjectRepository(TravelExpenseRequestCustomer)
    private readonly repo: Repository<TravelExpenseRequestCustomer>,
  ) {}

  create(dto: CreateTravelExpenseRequestCustomerDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findByRequest(travelExpenseRequestId: string) {
    return this.repo.find({
      where: { travelExpenseRequestId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity)
      throw new NotFoundException(
        `Travel expense request customer with ID ${id} not found`,
      );
    return entity;
  }

  async update(id: string, dto: UpdateTravelExpenseRequestCustomerDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
    return { message: 'Customer removed successfully' };
  }

  async removeByRequest(travelExpenseRequestId: string) {
    const items = await this.repo.find({ where: { travelExpenseRequestId } });
    if (!items.length) return { message: 'No customers found for this request', deleted: 0 };
    await this.repo.remove(items);
    return { message: 'Customers removed successfully', deleted: items.length };
  }
}
