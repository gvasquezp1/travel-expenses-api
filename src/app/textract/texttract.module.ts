import { Module } from '@nestjs/common';

import { TextractService } from './textract.service';
import { TextractController } from './texttract.controller';

@Module({
  controllers: [TextractController],
  providers: [TextractService],
})
export class TextractModule {}