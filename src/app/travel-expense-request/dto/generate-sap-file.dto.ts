import { IsArray, IsInt, ArrayMinSize } from 'class-validator';

export class GenerateSapFileDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  documentNumbers: number[];
}
