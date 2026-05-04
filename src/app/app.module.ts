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
import { TravelExpenseRequestModule } from './travel-expense-request/travel-expense-request.module';
import { ExpensePaymentMethodModule } from './expense-payment-method/expense-payment-method.module';
import { TextractModule } from './textract/texttract.module';
import { LinesModule } from './lines/lines.module';
import { UserApproverModule } from './user-approver/user-approver.module';
import { UserRoleModule } from './user-role/user-role.module';
import { RoleLineLimitModule } from './role-line-limit/role-line-limit.module';
import { LineRequestLimitModule } from './line-request-limit/line-request-limit.module';
import { UserCostCenterModule } from './user-cost-center/user-cost-center.module';
import { PermissionModule } from './permission/permission.module';
import { TravelExpenseRequestDetailModule } from './travel-expense-request-detail/travel-expense-request-detail.module';
import { BusinessPartnerModule } from './business-partner/business-partner.module';
import { MailModule } from './mail/mail.module';
import { TravelExpenseRequestCustomerModule } from './travel-expense-request-customer/travel-expense-request-customer.module';
import { TravelExpenseLegalizationModule } from './travel-expense-legalization/travel-expense-legalization.module';
import { TravelExpenseRequestStatusModule } from './travel-expense-request-status/travel-expense-request-status.module';
import { AppSettingsModule } from './app-settings/app-settings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TaxIndicatorModule } from './tax-indicator/tax-indicator.module';

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
    TravelExpenseRequestModule,
    ExpensePaymentMethodModule,
    TextractModule,
    LinesModule,
    UserApproverModule,
    UserRoleModule,
    RoleLineLimitModule,
    LineRequestLimitModule,
    UserCostCenterModule,
    PermissionModule,
    TravelExpenseRequestDetailModule,
    BusinessPartnerModule,
    MailModule,
    TravelExpenseRequestCustomerModule,
    TravelExpenseLegalizationModule,
    TravelExpenseRequestStatusModule,
    AppSettingsModule,
    DashboardModule,
    TaxIndicatorModule,
  ],
})
export class AppModule {}
