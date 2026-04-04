import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemModule } from './entities/system-module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class SystemModuleService {
  constructor(
    @InjectRepository(SystemModule)
    private readonly moduleRepo: Repository<SystemModule>,
  ) {}

  create(dto: CreateModuleDto) {
    const module = this.moduleRepo.create(dto);
    return this.moduleRepo.save(module);
  }

  findAll() {
    return this.moduleRepo.find({ relations: ['permissions'] });
  }

  async findOne(id: string) {
    const module = await this.moduleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!module) throw new NotFoundException('Módulo no encontrado');
    return module;
  }

  async update(id: string, dto: UpdateModuleDto) {
    await this.findOne(id);
    await this.moduleRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const module = await this.findOne(id);
    await this.moduleRepo.remove(module);
    return { message: 'Módulo eliminado correctamente' };
  }
}
