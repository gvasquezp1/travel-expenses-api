import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleLineLimit } from './entities/role-line-limit.entity';
import { RoleLineLimitService } from './role-line-limit.service';
import { RoleLineLimitController } from './role-line-limit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoleLineLimit])],
  controllers: [RoleLineLimitController],
  providers: [RoleLineLimitService],
})
export class RoleLineLimitModule {}
