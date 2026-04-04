import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemModule } from './entities/system-module.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { SystemModuleService } from './system-module.service';
import { PermissionService } from './permission.service';
import { RolePermissionService } from './role-permission.service';
import { PermissionSeedService } from './permission-seed.service';
import { SystemModuleController } from './system-module.controller';
import { PermissionController } from './permission.controller';
import { RolePermissionController } from './role-permission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemModule, Permission, RolePermission])],
  controllers: [
    SystemModuleController,
    PermissionController,
    RolePermissionController,
  ],
  providers: [SystemModuleService, PermissionService, RolePermissionService, PermissionSeedService],
  exports: [SystemModuleService, PermissionService, RolePermissionService],
})
export class PermissionModule {}
