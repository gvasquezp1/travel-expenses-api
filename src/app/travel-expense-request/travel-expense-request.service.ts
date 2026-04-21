import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TravelExpenseRequest } from './entities/travel-expense-request.entity';
import { CreateTravelExpenseRequestDto } from './dto/create-travel-expense-request.dto';
import { UpdateTravelExpenseRequestDto } from './dto/update-travel-expense-request.dto';
import { UserApprover } from '../user-approver/entities/user-approver.entity';

@Injectable()
export class TravelExpenseRequestService {
  constructor(
    @InjectRepository(TravelExpenseRequest)
    private readonly repository: Repository<TravelExpenseRequest>,
    @InjectRepository(UserApprover)
    private readonly userApproverRepository: Repository<UserApprover>,
  ) {}

  async create(createDto: CreateTravelExpenseRequestDto): Promise<TravelExpenseRequest> {
    try {
      // Obtener el siguiente número de documento automáticamente
      const nextDocumentNumber = await this.getNextDocumentNumber();
      
      const entity = this.repository.create({
        ...createDto,
        documentNumber: nextDocumentNumber,
      });
      
      return await this.repository.save(entity);
    } catch (error) {
      throw new BadRequestException('Error creating travel expense request');
    }
  }

  async findAll(): Promise<TravelExpenseRequest[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TravelExpenseRequest> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException(`Travel Expense Request with ID ${id} not found`);
    }
    return entity;
  }

  async findByRequestedForUser(userId: string): Promise<TravelExpenseRequest[]> {
    return await this.repository.find({
      where: { requestedForUserId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCreatedBy(userId: string): Promise<TravelExpenseRequest[]> {
    return await this.repository.find({
      where: { createdBy: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCostCenter(costCenterId: string): Promise<TravelExpenseRequest[]> {
    return await this.repository.find({
      where: { costCenterId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByApprover(approverUserId: string): Promise<TravelExpenseRequest[]> {
    const assignments = await this.userApproverRepository.find({
      where: { approverUserId },
    });

    if (!assignments.length) return [];

    const userIds = assignments.map((a) => a.userId);

    return await this.repository.find({
      where: { requestedForUserId: In(userIds) },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateDto: UpdateTravelExpenseRequestDto,
  ): Promise<TravelExpenseRequest> {
    const entity = await this.findOne(id);

    if (entity.locked) {
      throw new BadRequestException('Cannot update a locked travel expense request');
    }

    try {
      await this.repository.update(id, updateDto);
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException('Error updating travel expense request');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const entity = await this.findOne(id);

    if (entity.locked) {
      throw new BadRequestException('Cannot delete a locked travel expense request');
    }

    try {
      await this.repository.remove(entity);
      return { message: 'Travel Expense Request deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting travel expense request');
    }
  }

  async lock(id: string): Promise<TravelExpenseRequest> {
    const entity = await this.findOne(id);
    entity.locked = true;
    return await this.repository.save(entity);
  }

  async unlock(id: string): Promise<TravelExpenseRequest> {
    const entity = await this.findOne(id);
    entity.locked = false;
    return await this.repository.save(entity);
  }

  async incrementLegalizationConsecutive(id: string): Promise<number> {
    const entity = await this.findOne(id);
    entity.legalizationConsecutive = (entity.legalizationConsecutive || 0) + 1;
    await this.repository.save(entity);
    return entity.legalizationConsecutive;
  }

  private async getNextDocumentNumber(): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('request')
      .select('MAX(request.documentNumber)', 'max')
      .getRawOne<{ max: string | null }>();
    
    const maxNumber = result?.max ? Number(result.max) : 0;
    return maxNumber + 1;
  }
}