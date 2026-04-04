import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserApprover } from '../entities/user-approver.entity';
import { CreateUserApproverDto } from '../dto/create-user-approver.dto';
import { UpdateUserApproverDto } from '../dto/update-user-approver.dto';

@Injectable()
export class UserApproverService {
  
    constructor(
        @InjectRepository(UserApprover)
        private readonly repo: Repository<UserApprover>,
    ) {}
    
    async create(dto: CreateUserApproverDto) {
        const exists = await this.repo.findOne({
            where: { userId: dto.userId, approverUserId: dto.approverUserId },
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

  async update(id: string, dto: UpdateUserApproverDto) {
    const item = await this.repo.preload({ id, ...dto });
    if (!item) {
      throw new NotFoundException('No encontrado');
    }
    return this.repo.save(item);
  }

  async removeByUserId(userId: string) {
    const items = await this.repo.find({ where: { userId } });
    if (!items.length) {
      return { message: 'No hay aprobadores para este usuario', deleted: 0 };
    }

    await this.repo.remove(items);
    return { message: 'Aprobadores eliminados correctamente', deleted: items.length };
  }
}
