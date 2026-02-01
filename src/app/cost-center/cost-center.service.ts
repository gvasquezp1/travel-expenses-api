import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CostCenter } from './entities/cost-center.entity';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';

@Injectable()
export class CostCentersService {
  constructor(
    @InjectRepository(CostCenter)
    private costCenterRepository: Repository<CostCenter>,
  ) {}

  async create(createCostCenterDto: CreateCostCenterDto) {
    const costCenter = this.costCenterRepository.create(createCostCenterDto);
    return await this.costCenterRepository.save(costCenter);
  }

  async findAll() {
    return await this.costCenterRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const costCenter = await this.costCenterRepository.findOne({
      where: { id },
    });
    if (!costCenter) {
      throw new NotFoundException(`Cost Center with ID ${id} not found`);
    }
    return costCenter;
  }

  async update(id: string, updateCostCenterDto: UpdateCostCenterDto) {
    await this.findOne(id);
    await this.costCenterRepository.update(id, updateCostCenterDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    result.isActive = false;
    await this.costCenterRepository.update(id, result);
    return await this.findOne(id);
  }
}
