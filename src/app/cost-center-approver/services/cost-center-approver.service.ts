import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CostCenterApprover } from '../entities/cost-center-approver.entity';
import { CreateCostCenterApproverDto } from '../dto/create-cost-center-approver';
import { UpdateCostCenterApproverDto } from '../dto/update-cost-center-approver';

@Injectable()
export class CostCenterApproverService {
  constructor(
    @InjectRepository(CostCenterApprover)
    private readonly repo: Repository<CostCenterApprover>,
  ) {}

  async create(dto: CreateCostCenterApproverDto) {
    const exists = await this.repo.findOne({
      where: { costCenterId: dto.costCenterId, approverId: dto.approverId },
    });
    if (exists) throw new BadRequestException('Relacion ya existe');
    const entity = this.repo.create({
      ...dto,
      isPrimary: dto.isPrimary ?? false,
    });
    return await this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('No encontrado');
    return item;
  }

  async update(id: string, dto: UpdateCostCenterApproverDto) {
    const item = await this.repo.preload({ id, ...dto });
    if (!item) throw new NotFoundException('No encontrado');
    return await this.repo.save(item);
  }

  async remove(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('No encontrado');
    await this.repo.remove(item);
    return { message: 'Eliminado correctamente' };
  }
}
