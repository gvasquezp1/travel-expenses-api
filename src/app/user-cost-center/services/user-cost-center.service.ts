import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCostCenter } from '../entities/user-cost-center.entity';
import { CreateUserCostCenterDto } from '../dto/create-user-cost-center.dto';
import { UpdateUserCostCenterDto } from '../dto/update-user-cost-center.dto';

@Injectable()
export class UserCostCenterService {
  constructor(
    @InjectRepository(UserCostCenter)
    private readonly repo: Repository<UserCostCenter>,
  ) {}

  async create(dto: CreateUserCostCenterDto) {
    const exists = await this.repo.findOne({
      where: { userId: dto.userId, costCenterId: dto.costCenterId },
    });

    if (exists) {
      throw new BadRequestException('Relacion ya existe');
    }

    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  findByUserId(userId: string) {
    return this.repo.find({ where: { userId } });
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('No encontrado');
    }
    return item;
  }

  async update(id: string, dto: UpdateUserCostCenterDto) {
    const current = await this.findOne(id);

    const userId = dto.userId ?? current.userId;
    const costCenterId = dto.costCenterId ?? current.costCenterId;

    const exists = await this.repo.findOne({
      where: { userId, costCenterId },
    });

    if (exists && exists.id !== id) {
      throw new BadRequestException('Relacion ya existe');
    }

    const item = await this.repo.preload({ id, ...dto });
    if (!item) {
      throw new NotFoundException('No encontrado');
    }
    return this.repo.save(item);
  }

  async removeByUserId(userId: string) {
    const items = await this.repo.find({ where: { userId } });
    if (!items.length) {
      return { message: 'No hay centros de costo para este usuario', deleted: 0 };
    }

    await this.repo.remove(items);
    return {
      message: 'Centros de costo eliminados correctamente',
      deleted: items.length,
    };
  }
}
