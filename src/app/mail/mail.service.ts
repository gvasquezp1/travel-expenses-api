import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly defaultFrom: string;

  constructor(private readonly config: ConfigService) {
    sgMail.setApiKey(this.config.get<string>('SENDGRID_API_KEY')!);
    this.defaultFrom = this.config.get<string>('SENDGRID_FROM_EMAIL')!;
  }

  async send(dto: SendMailDto): Promise<{ message: string }> {
    try {
      await sgMail.send({
        to: dto.to,
        from: dto.from ?? this.defaultFrom,
        subject: dto.subject,
        html: dto.body,
      });

      this.logger.log(`Email sent to ${dto.to}`);
      return { message: 'Email enviado correctamente' };
    } catch (error) {
      this.logger.error(`Error sending email to ${dto.to}`, error?.response?.body ?? error);
      throw new InternalServerErrorException('Error al enviar el correo');
    }
  }
}
