import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePermissionDto {
  @IsUUID()
  @IsOptional()
  moduleId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
