import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelExpenseRequest } from './entities/travel-expense-request.entity';
import { TravelExpenseRequestService } from './travel-expense-request.service';
import { TravelExpenseRequestController } from './travel-expense-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TravelExpenseRequest])],
  controllers: [TravelExpenseRequestController],
  providers: [TravelExpenseRequestService],
  exports: [TravelExpenseRequestService],
})
export class TravelExpenseRequestModule {}
