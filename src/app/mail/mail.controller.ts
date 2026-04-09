import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  send(@Body() dto: SendMailDto) {
    return this.mailService.send(dto);
  }
}
