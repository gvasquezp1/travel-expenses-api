import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelExpenseService } from './travel-expense.service';
import { TravelExpenseController } from './travel-expense.controller';
import { TravelExpense } from './entities/travel-expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TravelExpense])],
  controllers: [TravelExpenseController],
  providers: [TravelExpenseService],
  exports: [TravelExpenseService],
})
export class TravelExpenseModule {}