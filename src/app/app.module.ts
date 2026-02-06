import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CostCentersModule } from './cost-center/cost-center.module';
import { CostCenterApproverModule } from './cost-center-approver/cost-center-approver.module';
import { TravelExpenseStatusModule } from './travel-expense-status/travel-expense-status.module';
import { ExpenseCategoryModule } from './expense-category/expense-category.module';
import { TravelExpenseModule } from './travel-expense/travel-expense.module';
import { ExpensePaymentMethodModule } from './expense-payment-method/expense-payment-method.module';
import { TextractModule } from './textract/texttract.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        ssl: { rejectUnauthorized: false },
        extra: { ssl: { rejectUnauthorized: false } },
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // ⚠️ solo dev
      }),
    }),
    UsersModule,
    AuthModule,
    CostCentersModule,
    CostCenterApproverModule,
    TravelExpenseStatusModule,
    ExpenseCategoryModule,
    TravelExpenseModule,
    ExpensePaymentMethodModule,
    TextractModule
  ],
})
export class AppModule {}
