import { IsString } from 'class-validator';

export class CreateUserApproverDto {
  @IsString()
  userId: string;

  @IsString()
  approverUserId: string;
}
