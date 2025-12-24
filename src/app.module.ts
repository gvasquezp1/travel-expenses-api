import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
        ssl: { rejectUnauthorized: false },      
        extra: { ssl: { rejectUnauthorized: false } }, 
        entities:[__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // ⚠️ solo dev
      }),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule { }