import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateLineRequestLimitDto {
  @IsOptional()
  @IsString()
  lineId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxRequests?: number;
}
