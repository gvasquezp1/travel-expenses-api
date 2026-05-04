import { IsString, IsEnum, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { SettingType } from '../entities/app-setting.entity';

export class CreateAppSettingDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsEnum(SettingType)
  @IsNotEmpty()
  type: SettingType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  group?: string;

  @IsBoolean()
  @IsOptional()
  isEditable?: boolean;
}
