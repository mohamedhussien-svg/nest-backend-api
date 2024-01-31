import {
  Body,
  ClassSerializerInterceptor,
  Controller, DefaultValuePipe,
  Get, Param, ParseIntPipe,
  Put, Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { EventService } from './event.service';
import { AttendeeService } from './attendee.service';
import { AuthGuardJwt } from '../auth/auth.guard.jwt';
import { CurrentUser } from '../auth/current-user.decorators';
import { UserEntity } from '../auth/user.entity';
import { PaginateEvent } from './event';
import { Attendee } from './attendee';
import { CreateUpdateAttendeeDto } from './dto/create.update.attendee.dto';

@Controller('/user-event-attendee')
@SerializeOptions({ strategy: 'excludeAll' })
export class CurrentUserEventAttendeeController {

  constructor(private readonly eventService: EventService,
              private readonly attendeeService: AttendeeService) {
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt)
  public async findAll(
    @Query('page',new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('size',new DefaultValuePipe(5), ParseIntPipe) size: number = 5,
    @CurrentUser() user: UserEntity): Promise<PaginateEvent> {
    return await this.eventService.getEventAttendeeForUser(user.id, {
      pageNumber: page,
      pageSize: size,
      totalCount: true
    });
  }

  @Get('/:eventId')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt)
  public async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: UserEntity): Promise<Attendee> {

    return await this.attendeeService.getAttendee(eventId, user.id);
  }

  @Put('/:eventId')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt)
  public async createOrUpdateAttendee(
    @Body() input: CreateUpdateAttendeeDto,
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: UserEntity) {

    return this.attendeeService.createOrUpdateAttendee(input, user.id, eventId);
  }
}
