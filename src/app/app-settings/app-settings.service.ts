import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppSetting, SettingType } from './entities/app-setting.entity';
import { CreateAppSettingDto } from './dto/create-app-setting.dto';
import { UpdateAppSettingDto } from './dto/update-app-setting.dto';

@Injectable()
export class AppSettingsService {
  constructor(
    @InjectRepository(AppSetting)
    private readonly settingRepository: Repository<AppSetting>,
  ) {}

  /**
   * Obtiene todas las configuraciones ordenadas por grupo y clave
   */
  async findAll(): Promise<AppSetting[]> {
    return this.settingRepository.find({
      order: {
        group: 'ASC',
        key: 'ASC',
      },
    });
  }

  /**
   * Busca una configuración por su clave
   */
  async findByKey(key: string): Promise<AppSetting> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    
    return setting;
  }

  /**
   * Crea una nueva configuración
   */
  async create(createDto: CreateAppSettingDto): Promise<AppSetting> {
    // Validar que el valor corresponda al tipo
    this.validateValueByType(createDto.value, createDto.type);

    // Verificar si ya existe una configuración con esa clave
    const existing = await this.settingRepository.findOne({
      where: { key: createDto.key },
    });

    if (existing) {
      throw new ConflictException(
        `Setting with key "${createDto.key}" already exists`,
      );
    }

    const setting = this.settingRepository.create(createDto);
    return this.settingRepository.save(setting);
  }

  /**
   * Actualiza una configuración existente
   */
  async update(
    key: string,
    updateDto: UpdateAppSettingDto,
  ): Promise<AppSetting> {
    const setting = await this.findByKey(key);

    // Verificar si la configuración es editable
    if (!setting.isEditable) {
      throw new ForbiddenException(
        `Setting "${key}" is not editable`,
      );
    }

    // Si se actualiza el valor, validar que corresponda al tipo
    if (updateDto.value !== undefined) {
      const typeToValidate = updateDto.type || setting.type;
      this.validateValueByType(updateDto.value, typeToValidate);
    }

    // Si se actualiza solo el tipo, validar que el valor actual corresponda
    if (updateDto.type && !updateDto.value) {
      this.validateValueByType(setting.value, updateDto.type);
    }

    Object.assign(setting, updateDto);
    return this.settingRepository.save(setting);
  }

  /**
   * Elimina una configuración
   */
  async remove(key: string): Promise<void> {
    const setting = await this.findByKey(key);

    // Verificar si la configuración es editable
    if (!setting.isEditable) {
      throw new ForbiddenException(
        `Setting "${key}" cannot be deleted`,
      );
    }

    await this.settingRepository.remove(setting);
  }

  /**
   * Obtiene el valor parseado de una configuración
   */
  async getParsedValue(key: string): Promise<any> {
    const setting = await this.findByKey(key);
    return this.parseValue(setting.value, setting.type);
  }

  /**
   * Convierte un valor string al tipo correspondiente
   */
  parseValue(value: string, type: SettingType): any {
    switch (type) {
      case SettingType.NUMBER:
        return Number(value);
      
      case SettingType.BOOLEAN:
        return value === 'true';
      
      case SettingType.JSON:
        try {
          return JSON.parse(value);
        } catch (error: any) {
          throw new BadRequestException('Invalid JSON value');
        }
      
      case SettingType.STRING:
      default:
        return value;
    }
  }

  /**
   * Valida que un valor corresponda al tipo especificado
   */
  validateValueByType(value: string, type: SettingType): void {
    switch (type) {
      case SettingType.NUMBER:
        const num = Number(value);
        if (isNaN(num)) {
          throw new BadRequestException(
            `Value "${value}" is not a valid number`,
          );
        }
        break;

      case SettingType.BOOLEAN:
        if (value !== 'true' && value !== 'false') {
          throw new BadRequestException(
            `Value "${value}" is not a valid boolean. Must be "true" or "false"`,
          );
        }
        break;

      case SettingType.JSON:
        try {
          JSON.parse(value);
        } catch (error) {
          throw new BadRequestException(
            `Value is not valid JSON: ${error.message}`,
          );
        }
        break;

      case SettingType.STRING:
        // String siempre es válido
        break;

      default:
        throw new BadRequestException(`Invalid type: ${type}`);
    }
  }
}
