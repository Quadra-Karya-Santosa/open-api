import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class CoreDB implements TypeOrmOptionsFactory {
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      entities: ['libs/entities/src/core/*.entity.ts'],
      autoLoadEntities: true,
      migrations: ['libs/entities/src/core/migrations/*.{ts,js}'],
      migrationsTableName: 'core_migrations',
      migrationsRun: true,
      logger: 'file',
      logging: ['error', 'query', 'log'],
      synchronize: false,
    };
  }
}
