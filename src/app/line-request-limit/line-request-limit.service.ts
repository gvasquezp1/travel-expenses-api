import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineRequestLimit } from './entities/line-request-limit.entity';
import { CreateLineRequestLimitDto } from './dto/create-line-request-limit.dto';
import { UpdateLineRequestLimitDto } from './dto/update-line-request-limit.dto';

@Injectable()
export class LineRequestLimitService {
  constructor(
    @InjectRepository(LineRequestLimit)
    private readonly lineRequestLimitRepository: Repository<LineRequestLimit>,
  ) {}

  async create(createLineRequestLimitDto: CreateLineRequestLimitDto) {
    const item = this.lineRequestLimitRepository.create(createLineRequestLimitDto);
    return this.lineRequestLimitRepository.save(item);
  }

  async findAll() {
    return this.lineRequestLimitRepository.find();
  }

  async findOne(id: string) {
    return this.lineRequestLimitRepository.findOneBy({ id });
  }

  async update(id: string, updateLineRequestLimitDto: UpdateLineRequestLimitDto) {
    await this.lineRequestLimitRepository.update(id, updateLineRequestLimitDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const item = await this.lineRequestLimitRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('No encontrado');
    }
    await this.lineRequestLimitRepository.remove(item);
    return { message: 'Eliminado correctamente' };
  }
}
