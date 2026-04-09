import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelExpenseRequest } from './entities/travel-expense-request.entity';
import { TravelExpenseRequestService } from './travel-expense-request.service';
import { TravelExpenseRequestController } from './travel-expense-request.controller';
import { UserApprover } from '../user-approver/entities/user-approver.entity';
import { TravelExpenseRequestDetail } from '../travel-expense-request-detail/entities/travel-expense-request-detail.entity';
import { TravelExpenseRequestCustomer } from '../travel-expense-request-customer/entities/travel-expense-request-customer.entity';
import { TravelExpenseRequestExcelService } from './travel-expense-request-excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([TravelExpenseRequest, UserApprover, TravelExpenseRequestDetail, TravelExpenseRequestCustomer])],
  controllers: [TravelExpenseRequestController],
  providers: [TravelExpenseRequestService, TravelExpenseRequestExcelService],
  exports: [TravelExpenseRequestService],
})
export class TravelExpenseRequestModule {}
