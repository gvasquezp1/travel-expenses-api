import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelExpenseRequestCustomer } from './entities/travel-expense-request-customer.entity';
import { TravelExpenseRequestCustomerService } from './travel-expense-request-customer.service';
import { TravelExpenseRequestCustomerController } from './travel-expense-request-customer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TravelExpenseRequestCustomer])],
  controllers: [TravelExpenseRequestCustomerController],
  providers: [TravelExpenseRequestCustomerService],
  exports: [TravelExpenseRequestCustomerService],
})
export class TravelExpenseRequestCustomerModule {}
