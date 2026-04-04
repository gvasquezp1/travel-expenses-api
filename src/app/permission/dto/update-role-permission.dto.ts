import { IsBoolean } from 'class-validator';

export class UpdateRolePermissionDto {
  @IsBoolean()
  hasAccess: boolean;
}
