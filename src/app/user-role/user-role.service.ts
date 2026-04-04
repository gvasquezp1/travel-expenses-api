import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './entities/user-role.entity';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createUserRoleDto: CreateUserRoleDto) {
    const userRole = this.userRoleRepository.create(createUserRoleDto);
    return this.userRoleRepository.save(userRole);
  }

  async findAll() {
    return this.userRoleRepository.find();
  }

  async findOne(id: string) {
    return this.userRoleRepository.findOneBy({ id });
  }

  async update(id: string, updateUserRoleDto: UpdateUserRoleDto) {
    await this.userRoleRepository.update(id, updateUserRoleDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.userRoleRepository.update(id, { locked: true });
    return this.findOne(id);
  }
}
