import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessPartner } from './entities/business-partner.entity';
import { CreateBusinessPartnerDto } from './dto/create-business-partner.dto';
import { UpdateBusinessPartnerDto } from './dto/update-business-partner.dto';
import { BulkUpsertBusinessPartnerDto } from './dto/bulk-upsert-business-partner.dto';

@Injectable()
export class BusinessPartnerService {
  constructor(
    @InjectRepository(BusinessPartner)
    private readonly businessPartnerRepo: Repository<BusinessPartner>,
  ) {}

  create(dto: CreateBusinessPartnerDto) {
    const businessPartner = this.businessPartnerRepo.create(dto);
    return this.businessPartnerRepo.save(businessPartner);
  }

  findAll() {
    return this.businessPartnerRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const businessPartner = await this.businessPartnerRepo.findOne({ where: { id } });
    if (!businessPartner) throw new NotFoundException(`Business Partner con ID ${id} no encontrado`);
    return businessPartner;
  }

  async update(id: string, dto: UpdateBusinessPartnerDto) {
    await this.findOne(id);
    await this.businessPartnerRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const businessPartner = await this.findOne(id);
    await this.businessPartnerRepo.remove(businessPartner);
    return { message: 'Business Partner eliminado correctamente' };
  }

  async upsertBulk(dto: BulkUpsertBusinessPartnerDto) {
    await this.businessPartnerRepo.upsert(dto.items, {
      conflictPaths: ['sapCode'],
      skipUpdateIfNoValuesChanged: true,
    });
    return { message: `${dto.items.length} business partner(s) procesados correctamente` };
  }
}
