import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensePaymentMethodService } from './expense-payment-method.service';
import { ExpensePaymentMethod } from './entities/expense-payment-method.entity';
import { ExpensePaymentMethodController } from './expense-payment-method.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExpensePaymentMethod])],
  controllers: [ExpensePaymentMethodController],
  providers: [ExpensePaymentMethodService],
})
export class ExpensePaymentMethodModule {}