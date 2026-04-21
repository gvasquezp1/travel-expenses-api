import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { TravelExpenseLegalization } from './entities/travel-expense-legalization.entity';
import { CreateTravelExpenseLegalizationDto } from './dto/create-travel-expense-legalization.dto';
import { UpdateTravelExpenseLegalizationDto } from './dto/update-travel-expense-legalization.dto';
import { TravelExpenseRequestService } from '../travel-expense-request/travel-expense-request.service';

@Injectable()
export class TravelExpenseLegalizationService {
  constructor(
    @InjectRepository(TravelExpenseLegalization)
    private readonly repo: Repository<TravelExpenseLegalization>,
    private readonly travelExpenseRequestService: TravelExpenseRequestService,
  ) {}

  async create(dto: CreateTravelExpenseLegalizationDto) {
    const categoryConsecutive = await this.getNextCategoryConsecutive(dto);
    const payload = this.applyFinancialRules({ ...dto, categoryConsecutive });
    const entity = this.repo.create(payload);
    const saved = await this.repo.save(entity);
    
    // Incrementar el consecutivo de legalización en la solicitud si está asociada
    if (saved.travelExpenseRequestId) {
      await this.travelExpenseRequestService.incrementLegalizationConsecutive(
        saved.travelExpenseRequestId,
      );
    }
    
    return saved;
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findByRequest(travelExpenseRequestId: string) {
    return this.repo.find({
      where: { travelExpenseRequestId },
      order: { dayNumber: 'ASC', createdAt: 'ASC' },
    });
  }

  findByDetail(travelExpenseRequestDetailId: string) {
    return this.repo.find({
      where: { travelExpenseRequestDetailId },
      order: { dayNumber: 'ASC' },
    });
  }

  findIndependent() {
    return this.repo.find({
      where: {
        travelExpenseRequestId: IsNull(),
        travelExpenseRequestDetailId: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity)
      throw new NotFoundException(`Travel expense legalization ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateTravelExpenseLegalizationDto) {
    const current = await this.findOne(id);
    const shouldRecalculateConsecutive =
      dto.categoryId != null ||
      dto.travelExpenseRequestId !== undefined ||
      dto.travelExpenseRequestDetailId !== undefined;

    const merged = { ...current, ...dto };

    const categoryConsecutive = shouldRecalculateConsecutive
      ? await this.getNextCategoryConsecutive(merged, id)
      : current.categoryConsecutive;

    await this.repo.update(
      id,
      this.applyFinancialRules({ ...merged, categoryConsecutive }),
    );
    return this.findOne(id);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
    return { message: 'Legalization deleted successfully' };
  }

  async removeByRequest(travelExpenseRequestId: string) {
    const items = await this.repo.find({ where: { travelExpenseRequestId } });
    if (!items.length)
      return { message: 'No legalizations found for this request', deleted: 0 };
    await this.repo.remove(items);
    return { message: 'Legalizations deleted successfully', deleted: items.length };
  }

  private applyFinancialRules(
    input: Partial<TravelExpenseLegalization>,
  ): Partial<TravelExpenseLegalization> {
    const invoiceAmount = this.toNumber(input.invoiceAmount);
    const amountApproved = this.toNullableNumber(input.amountApproved);

    if (amountApproved == null || invoiceAmount == null) {
      return {
        ...input,
        balance: null,
        isOverAuthorized: false,
        exceededAmount: 0,
      };
    }

    const balance = amountApproved - invoiceAmount;
    const exceededAmount = invoiceAmount > amountApproved ? invoiceAmount - amountApproved : 0;

    return {
      ...input,
      balance,
      isOverAuthorized: exceededAmount > 0,
      exceededAmount,
    };
  }

  private toNumber(value: unknown): number | null {
    if (value == null || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  private toNullableNumber(value: unknown): number | null {
    return this.toNumber(value);
  }

  private async getNextCategoryConsecutive(
    input: Partial<TravelExpenseLegalization>,
    excludeId?: string,
  ): Promise<number> {
    const qb = this.repo
      .createQueryBuilder('l')
      .select('MAX(l.categoryConsecutive)', 'max')
      .where('l.categoryId = :categoryId', { categoryId: input.categoryId });

    if (excludeId) {
      qb.andWhere('l.id <> :excludeId', { excludeId });
    }

    if (input.travelExpenseRequestId) {
      qb.andWhere('l.travelExpenseRequestId = :requestId', {
        requestId: input.travelExpenseRequestId,
      });
    } else {
      qb.andWhere('l.travelExpenseRequestId IS NULL');
    }

    if (input.travelExpenseRequestDetailId) {
      qb.andWhere('l.travelExpenseRequestDetailId = :detailId', {
        detailId: input.travelExpenseRequestDetailId,
      });
    } else {
      qb.andWhere('l.travelExpenseRequestDetailId IS NULL');
    }

    const raw = await qb.getRawOne<{ max: string | null }>();
    const max = raw?.max ? Number(raw.max) : 0;
    return max + 1;
  }
}