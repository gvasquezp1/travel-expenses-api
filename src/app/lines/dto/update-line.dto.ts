import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateLineDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}
