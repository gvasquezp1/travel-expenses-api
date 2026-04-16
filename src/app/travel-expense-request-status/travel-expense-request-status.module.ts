import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelExpenseRequestStatus } from './entities/travel-expense-request-status.entity';
import { TravelExpenseRequestStatusService } from './travel-expense-request-status.service';
import { TravelExpenseRequestStatusController } from './travel-expense-request-status.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TravelExpenseRequestStatus])],
  providers: [TravelExpenseRequestStatusService],
  controllers: [TravelExpenseRequestStatusController],
  exports: [TravelExpenseRequestStatusService],
})
export class TravelExpenseRequestStatusModule {}
