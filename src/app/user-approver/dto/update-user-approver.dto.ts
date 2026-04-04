import { IsOptional, IsString } from 'class-validator';

export class UpdateUserApproverDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  approverUserId?: string;
}
