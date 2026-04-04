import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
  ) {}

  create(dto: CreateRolePermissionDto) {
    const rp = this.rolePermissionRepo.create(dto);
    return this.rolePermissionRepo.save(rp);
  }

  findAll() {
    return this.rolePermissionRepo.find({
      relations: ['role', 'permission', 'permission.module'],
    });
  }

  async findOne(id: string) {
    const rp = await this.rolePermissionRepo.findOne({
      where: { id },
      relations: ['role', 'permission', 'permission.module'],
    });
    if (!rp) throw new NotFoundException('Asignación de permiso no encontrada');
    return rp;
  }

  findByRole(roleId: string) {
    return this.rolePermissionRepo.find({
      where: { roleId },
      relations: ['permission', 'permission.module'],
    });
  }

  async update(id: string, dto: UpdateRolePermissionDto) {
    await this.findOne(id);
    await this.rolePermissionRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const rp = await this.findOne(id);
    await this.rolePermissionRepo.remove(rp);
    return { message: 'Asignación de permiso eliminada correctamente' };
  }
}
