import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  create(dto: CreatePermissionDto) {
    const permission = this.permissionRepo.create(dto);
    return this.permissionRepo.save(permission);
  }

  findAll() {
    return this.permissionRepo.find({ relations: ['module'] });
  }

  async findOne(id: string) {
    const permission = await this.permissionRepo.findOne({
      where: { id },
      relations: ['module'],
    });
    if (!permission) throw new NotFoundException('Permiso no encontrado');
    return permission;
  }

  findByModule(moduleId: string) {
    return this.permissionRepo.find({
      where: { moduleId },
      relations: ['module'],
    });
  }

  async update(id: string, dto: UpdatePermissionDto) {
    await this.findOne(id);
    await this.permissionRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const permission = await this.findOne(id);
    await this.permissionRepo.remove(permission);
    return { message: 'Permiso eliminado correctamente' };
  }
}
