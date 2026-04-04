import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineRequestLimit } from './entities/line-request-limit.entity';
import { LineRequestLimitService } from './line-request-limit.service';
import { LineRequestLimitController } from './line-request-limit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LineRequestLimit])],
  controllers: [LineRequestLimitController],
  providers: [LineRequestLimitService],
})
export class LineRequestLimitModule {}
