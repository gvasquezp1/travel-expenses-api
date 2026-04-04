import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { RoleLineLimit } from './entities/role-line-limit.entity';
import { CreateRoleLineLimitDto } from './dto/create-role-line-limit.dto';
import { UpdateRoleLineLimitDto } from './dto/update-role-line-limit.dto';

@Injectable()
export class RoleLineLimitService {
  constructor(
    @InjectRepository(RoleLineLimit)
    private readonly roleLineLimitRepository: Repository<RoleLineLimit>,
  ) {}

  async create(createRoleLineLimitDto: CreateRoleLineLimitDto) {
    const exists = await this.roleLineLimitRepository.findOne({
      where: {
        lineId: createRoleLineLimitDto.lineId,
        userRoleId: createRoleLineLimitDto.userRoleId,
        expenseCategoryId: createRoleLineLimitDto.expenseCategoryId,
        locked: false,
      },
    });

    if (exists) {
      throw new BadRequestException(
        'Ya existe un tope para este rol y categoría de gasto',
      );
    }

    const roleLineLimit = this.roleLineLimitRepository.create(createRoleLineLimitDto);
    return this.roleLineLimitRepository.save(roleLineLimit);
  }

  async findAll() {
    return this.roleLineLimitRepository.find();
  }

  async findOne(id: string) {
    return this.roleLineLimitRepository.findOneBy({ id });
  }

  async update(id: string, updateRoleLineLimitDto: UpdateRoleLineLimitDto) {
    const current = await this.roleLineLimitRepository.findOneBy({ id });
    if (!current) {
      return null;
    }

    const lineId = updateRoleLineLimitDto.lineId ?? current.lineId;
    const userRoleId = updateRoleLineLimitDto.userRoleId ?? current.userRoleId;
    const expenseCategoryId =
      updateRoleLineLimitDto.expenseCategoryId ?? current.expenseCategoryId;

    const exists = await this.roleLineLimitRepository.findOne({
      where: {
        id: Not(id),
        lineId,
        userRoleId,
        expenseCategoryId,
        locked: false,
      },
    });

    if (exists) {
      throw new BadRequestException(
        'Ya existe un tope para este rol y categoría de gasto',
      );
    }

    await this.roleLineLimitRepository.update(id, updateRoleLineLimitDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.roleLineLimitRepository.update(id, { locked: true });
    return this.findOne(id);
  }
}
