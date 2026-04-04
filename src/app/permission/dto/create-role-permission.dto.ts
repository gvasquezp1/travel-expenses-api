import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateRolePermissionDto {
  @IsUUID()
  roleId: string;

  @IsUUID()
  permissionId: string;

  @IsBoolean()
  @IsOptional()
  hasAccess?: boolean;
}
