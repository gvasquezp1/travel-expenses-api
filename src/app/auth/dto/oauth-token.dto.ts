import { IsString } from 'class-validator';

export class OauthTokenDto {
  @IsString()
  client_id: string;

  @IsString()
  client_secret: string;

  @IsString()
  code: string;

  @IsString()
  redirect_uri: string;

  @IsString()
  grant_type: string;
}
