import { IsInt, IsString, Min } from 'class-validator';

export class CreateLineRequestLimitDto {
  @IsString()
  lineId: string;

  @IsInt()
  @Min(0)
  maxRequests: number;
}
