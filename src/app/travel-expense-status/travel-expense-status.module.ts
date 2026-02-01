import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelExpenseStatus } from './entities/travel-expense-status.entity';
import { TravelExpenseStatusService } from './travel-expense-status.service';
import { TravelExpenseStatusController } from './travel-expense-status.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TravelExpenseStatus])],
  controllers: [TravelExpenseStatusController],
  providers: [TravelExpenseStatusService],
})
export class TravelExpenseStatusModule {}
