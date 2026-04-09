import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessPartner } from './entities/business-partner.entity';
import { BusinessPartnerService } from './business-partner.service';
import { BusinessPartnerController } from './business-partner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessPartner])],
  controllers: [BusinessPartnerController],
  providers: [BusinessPartnerService],
  exports: [BusinessPartnerService],
})
export class BusinessPartnerModule {}
