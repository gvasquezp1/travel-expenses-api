import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AppSettingsService } from './app-settings.service';
import { CreateAppSettingDto } from './dto/create-app-setting.dto';
import { UpdateAppSettingDto } from './dto/update-app-setting.dto';

@Controller('settings')
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateAppSettingDto) {
    const setting = await this.appSettingsService.create(createDto);
    const parsedValue = this.appSettingsService.parseValue(
      setting.value,
      setting.type,
    );
    
    return {
      ...setting,
      parsedValue,
    };
  }

  @Get()
  async findAll() {
    const settings = await this.appSettingsService.findAll();
    
    return settings.map((setting) => ({
      ...setting,
      parsedValue: this.appSettingsService.parseValue(
        setting.value,
        setting.type,
      ),
    }));
  }

  @Get(':key')
  async findOne(@Param('key') key: string) {
    const setting = await this.appSettingsService.findByKey(key);
    const parsedValue = this.appSettingsService.parseValue(
      setting.value,
      setting.type,
    );
    
    return {
      ...setting,
      parsedValue,
    };
  }

  @Get(':key/value')
  async getValue(@Param('key') key: string) {
    const parsedValue = await this.appSettingsService.getParsedValue(key);
    
    return {
      key,
      value: parsedValue,
    };
  }

  @Patch(':key')
  async update(
    @Param('key') key: string,
    @Body() updateDto: UpdateAppSettingDto,
  ) {
    const setting = await this.appSettingsService.update(key, updateDto);
    const parsedValue = this.appSettingsService.parseValue(
      setting.value,
      setting.type,
    );
    
    return {
      ...setting,
      parsedValue,
    };
  }

  @Delete(':key')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('key') key: string) {
    await this.appSettingsService.remove(key);
  }
}
