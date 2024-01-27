import { Event } from '../events/event';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';
import { Attendee } from '../events/attendee';
import { Subject } from '../school/school/subject.entity';
import { Teacher } from '../school/school/teacher.entity';
import { UserEntity } from '../auth/user.entity';
import { ProfileEntity } from '../auth/profile.entity';

export default registerAs('orm.config',
  (): TypeOrmModuleOptions => (
    {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSOORD,
      database: process.env.DB_DATABASE,
      entities: [Event, Attendee, Subject, Teacher,UserEntity,ProfileEntity],
      synchronize: true
    }
  ));
