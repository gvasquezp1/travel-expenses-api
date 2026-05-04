import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TravelExpenseRequest } from '../travel-expense-request/entities/travel-expense-request.entity';
import { TravelExpenseRequestDetail } from '../travel-expense-request-detail/entities/travel-expense-request-detail.entity';
import { TravelExpenseRequestStatus } from '../travel-expense-request-status/entities/travel-expense-request-status.entity';
import { UserApprover } from '../user-approver/entities/user-approver.entity';
import { RolePermission } from '../permission/entities/role-permission.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TravelExpenseRequest,
      TravelExpenseRequestDetail,
      TravelExpenseRequestStatus,
      UserApprover,
      RolePermission,
      User,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
