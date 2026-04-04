import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserApprover } from './entities/user-approver.entity';
import { UserApproverService } from './services/user-approver.service';
import { UserApproverController } from './user-approver.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserApprover])],
  controllers: [UserApproverController],
  providers: [UserApproverService],
})
export class UserApproverModule {}
