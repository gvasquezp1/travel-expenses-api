import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateLineDto {
  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;
}
