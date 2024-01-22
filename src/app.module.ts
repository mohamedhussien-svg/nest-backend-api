import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3307,
    username: 'root',
    password: 'example',
    entities: [Event],
    database: 'nest-events',
    synchronize: true
  }), TypeOrmModule.forFeature([Event])],
  controllers: [AppController, EventsController],
  providers: [AppService]
})
export class AppModule {
}
