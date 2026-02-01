import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostCenterApprover } from './entities/cost-center-approver.entity';
import { CostCenterApproverService } from './services/cost-center-approver.service';
import { CostCentersController } from './cost-center-approver.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CostCenterApprover])],
  controllers: [CostCentersController],
  providers: [CostCenterApproverService],
})
export class CostCenterApproverModule {}
