import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCostCenter } from './entities/user-cost-center.entity';
import { UserCostCenterService } from './services/user-cost-center.service';
import { UserCostCenterController } from './user-cost-center.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserCostCenter])],
  controllers: [UserCostCenterController],
  providers: [UserCostCenterService],
})
export class UserCostCenterModule {}
