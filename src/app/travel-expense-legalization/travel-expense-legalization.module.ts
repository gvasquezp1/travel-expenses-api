import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelExpenseLegalization } from './entities/travel-expense-legalization.entity';
import { TravelExpenseLegalizationService } from './travel-expense-legalization.service';
import { TravelExpenseLegalizationController } from './travel-expense-legalization.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TravelExpenseLegalization])],
  controllers: [TravelExpenseLegalizationController],
  providers: [TravelExpenseLegalizationService],
  exports: [TravelExpenseLegalizationService],
})
export class TravelExpenseLegalizationModule {}
