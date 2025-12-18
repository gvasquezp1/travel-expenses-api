import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // lee .env  [oai_citation:4‡docs.nestjs.com](https://docs.nestjs.com/techniques/configuration?utm_source=chatgpt.com)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        ssl: { rejectUnauthorized: false },      // 👈 clave
        extra: { ssl: { rejectUnauthorized: false } }, // 👈 a veces necesario con pg


        synchronize: true, // ⚠️ solo dev
      }),
    }),
    UsersModule,
  ],
})
export class AppModule { }