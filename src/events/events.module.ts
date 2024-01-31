import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event';
import { Attendee } from './attendee';
import { EventService } from './event.service';
import { AttendeeService } from './attendee.service';
import { AttendeeController } from './attendee.controller';
import { CurrentUserEventAttendeeController } from './current.user.event.attendee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [EventsController, AttendeeController,CurrentUserEventAttendeeController],
  providers: [EventService, AttendeeService]
})
export class EventsModule {
}
