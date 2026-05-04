import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxIndicator } from './entities/tax-indicator.entity';
import { CreateTaxIndicatorDto } from './dto/create-tax-indicator.dto';
import { UpdateTaxIndicatorDto } from './dto/update-tax-indicator.dto';

@Injectable()
export class TaxIndicatorService {
  constructor(
    @InjectRepository(TaxIndicator)
    private taxIndicatorRepository: Repository<TaxIndicator>,
  ) {}

  async create(createTaxIndicatorDto: CreateTaxIndicatorDto) {
    const taxIndicator = this.taxIndicatorRepository.create(
      createTaxIndicatorDto,
    );
    return await this.taxIndicatorRepository.save(taxIndicator);
  }

  async findAll() {
    return await this.taxIndicatorRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const taxIndicator = await this.taxIndicatorRepository.findOne({
      where: { id },
    });
    if (!taxIndicator) {
      throw new NotFoundException(`Tax Indicator with ID ${id} not found`);
    }
    return taxIndicator;
  }

  async update(id: string, updateTaxIndicatorDto: UpdateTaxIndicatorDto) {
    await this.findOne(id);
    await this.taxIndicatorRepository.update(id, updateTaxIndicatorDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    result.isActive = false;
    await this.taxIndicatorRepository.update(id, result);
    return await this.findOne(id);
  }
}
