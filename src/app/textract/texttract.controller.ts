import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TextractService } from './textract.service';

@Controller('textract')
export class TextractController {
  constructor(private readonly service: TextractService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  analyze(@UploadedFile() file: Express.Multer.File) {
    return this.service.analyzeInvoice(file);
  }
}