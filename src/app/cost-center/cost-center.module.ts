import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostCentersService } from './cost-center.service';
import { CostCentersController } from './cost-center.controller';
import { CostCenter } from './entities/cost-center.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CostCenter])],
    controllers: [CostCentersController],
    providers: [CostCentersService],
    exports: [CostCentersService],
})
export class CostCentersModule {}
