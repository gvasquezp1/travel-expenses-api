import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { CreateBusinessPartnerDto } from './create-business-partner.dto';

export class BulkUpsertBusinessPartnerDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBusinessPartnerDto)
  items: CreateBusinessPartnerDto[] = [];
}
