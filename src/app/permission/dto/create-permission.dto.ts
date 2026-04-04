import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePermissionDto {
  @IsUUID()
  moduleId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;
}
