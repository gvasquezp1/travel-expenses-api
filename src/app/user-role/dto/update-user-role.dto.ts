import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserRoleDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}
