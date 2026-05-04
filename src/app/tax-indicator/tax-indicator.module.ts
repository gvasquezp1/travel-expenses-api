import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxIndicatorService } from './tax-indicator.service';
import { TaxIndicatorController } from './tax-indicator.controller';
import { TaxIndicator } from './entities/tax-indicator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaxIndicator])],
  controllers: [TaxIndicatorController],
  providers: [TaxIndicatorService],
  exports: [TaxIndicatorService],
})
export class TaxIndicatorModule {}
