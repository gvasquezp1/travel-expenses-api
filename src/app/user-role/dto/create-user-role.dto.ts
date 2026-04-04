import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserRoleDto {
  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}
