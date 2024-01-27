import { Event } from '../events/event';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';

export default registerAs('orm.config',
  (): TypeOrmModuleOptions => (
    {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSOORD,
      database: process.env.DB_DATABASE,
      entities: [Event],
      synchronize: true
    }
  ));
