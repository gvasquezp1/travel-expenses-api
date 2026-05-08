import { IsString, IsOptional } from 'class-validator';

export class OauthCallbackDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsString()
  client_id: string;
}
