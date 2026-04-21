import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelExpenseLegalization } from './entities/travel-expense-legalization.entity';
import { TravelExpenseLegalizationService } from './travel-expense-legalization.service';
import { TravelExpenseLegalizationController } from './travel-expense-legalization.controller';
import { TravelExpenseRequestModule } from '../travel-expense-request/travel-expense-request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelExpenseLegalization]),
    TravelExpenseRequestModule,
  ],
  controllers: [TravelExpenseLegalizationController],
  providers: [TravelExpenseLegalizationService],
  exports: [TravelExpenseLegalizationService],
})
export class TravelExpenseLegalizationModule {}