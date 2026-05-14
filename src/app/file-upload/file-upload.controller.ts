import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Query('uploadedBy') uploadedBy?: string,
  ): Promise<UploadFileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.fileUploadService.uploadFile(file, uploadedBy);
  }

  @Get()
  async findAll() {
    return this.fileUploadService.findAll();
  }

  @Get('by-filename/:fileName')
  async findByFileName(@Param('fileName') fileName: string) {
    return this.fileUploadService.findByFileName(fileName);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.fileUploadService.findOne(id);
  }

  @Get(':id/signed-url')
  async getSignedUrl(
    @Param('id') id: string,
    @Query('expiresInMinutes') expiresInMinutes?: string,
  ) {
    const expires = expiresInMinutes ? parseInt(expiresInMinutes) : 52560000;
    const signedUrl = await this.fileUploadService.getSignedUrl(id, expires);
    return { signedUrl };
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    await this.fileUploadService.deleteFile(id);
    return { message: 'File deleted successfully' };
  }
}
