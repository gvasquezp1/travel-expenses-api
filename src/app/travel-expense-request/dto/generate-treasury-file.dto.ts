import { IsArray, IsInt, ArrayMinSize } from 'class-validator';

export class GenerateTreasuryFileDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  documentNumbers: number[];
}
