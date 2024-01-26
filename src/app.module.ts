import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { AppJapanService } from './app.japan.service';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig, ormConfigProd],
      expandVariables: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NOD === 'local' ? ormConfig : ormConfigProd
    }), EventsModule],
  controllers: [AppController],
  providers: [{
    provide: AppService,
    useClass: AppJapanService
  }, {
    provide: 'APP_NAME',
    useValue: 'NEST APPLICATION'
  }]
})
export class AppModule {
}
