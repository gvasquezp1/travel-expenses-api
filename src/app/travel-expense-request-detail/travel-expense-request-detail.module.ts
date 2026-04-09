import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelExpenseRequestDetail } from './entities/travel-expense-request-detail.entity';
import { TravelExpenseRequestDetailService } from './travel-expense-request-detail.service';
import { TravelExpenseRequestDetailController } from './travel-expense-request-detail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TravelExpenseRequestDetail])],
  controllers: [TravelExpenseRequestDetailController],
  providers: [TravelExpenseRequestDetailService],
  exports: [TravelExpenseRequestDetailService],
})
export class TravelExpenseRequestDetailModule {}
