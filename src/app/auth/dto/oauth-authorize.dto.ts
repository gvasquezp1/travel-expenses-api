import { IsString, IsOptional } from 'class-validator';

export class OauthAuthorizeDto {
  @IsString()
  client_id: string;

  @IsString()
  redirect_uri: string;

  @IsString()
  response_type: string;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  mock_user_id?: string;
}
