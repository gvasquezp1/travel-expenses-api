import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Line } from './entities/line.entity';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';

@Injectable()
export class LinesService {
  constructor(
    @InjectRepository(Line)
    private readonly lineRepository: Repository<Line>,
  ) {}

  async create(createLineDto: CreateLineDto) {
    const line = this.lineRepository.create(createLineDto);
    return this.lineRepository.save(line);
  }

  async findAll() {
    return this.lineRepository.find();
  }

  async findOne(id: string) {
    return this.lineRepository.findOneBy({ id });
  }

  async update(id: string, updateLineDto: UpdateLineDto) {
    await this.lineRepository.update(id, updateLineDto);
    return this.findOne(id);
  }

  async replace(id: string, updateLineDto: UpdateLineDto) {
    await this.lineRepository.update(id, updateLineDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.lineRepository.update(id, { locked: true });
    return this.findOne(id);
  }
}
