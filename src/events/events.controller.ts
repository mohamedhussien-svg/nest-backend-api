import {
  Body, ClassSerializerInterceptor,
  Controller, DefaultValuePipe,
  Delete, Get,
  HttpCode, Logger, Param,
  ParseIntPipe,
  Patch,
  Post, Query, SerializeOptions, UseGuards, UseInterceptors
} from '@nestjs/common';
import { CreateEventDto } from './dto/create.event.dto';
import { UpdateEventDto } from './dto/update.event.dto';
import { Event, PaginateEvent } from './event';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee';
import { EventService } from './event.service';
import { ListEventFilter } from './dto/list.event.filter';
import { PaginationResult } from '../pagination/paginator';
import { AuthGuardJwt } from '../auth/auth.guard.jwt';
import { CurrentUser } from '../auth/current-user.decorators';
import { UserEntity } from '../auth/user.entity';

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
    @InjectRepository(Attendee) private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventService: EventService
  ) {
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEventFilter): Promise<PaginationResult<Event>> {
    this.logger.log('findAll started');
    const events = await this.eventService.findEventsByFilter(filter);
    this.logger.log(events);
    return events;
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event | undefined> {

    return await this.eventService.getEventById(id);
    // return await this.repository.findOne({
    //   where: { id: id },
    //   //loadEagerRelations: true,
    //   relations: ['attendees']
    // });

  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: UserEntity): Promise<Event> {
    return await this.eventService.create(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  async update(@Param('id', ParseIntPipe) id: number,
               @Body() input: UpdateEventDto,
               @CurrentUser() user: UserEntity): Promise<Event> {
    return await this.eventService.update(id, input, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: UserEntity) {
    await this.eventService.remove(id, user);
  }

  @Get('/practice')
  async getByPractice(): Promise<any> {
    return await this.repository.find({
      select: ['id', 'when'],
      where: [
        { id: MoreThan(2), when: MoreThan(new Date('1980-12-12')) },
        { description: Like('%check%') }
      ],
      take: 2,
      order: { id: 'DESC' }
    });
  }

  @Get('/practice2/:id')
  async addEventAttendees(@Param('id', ParseIntPipe) id: number) {
    const event = await this.repository.findOne({ where: { id: id }, relations: ['attendees'] });
    const attendee: Attendee = new Attendee();
    event.attendees.push(attendee);
    await this.repository.save(event);
  }

  @Get('/organizer/:userId')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt)
  async findEventsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page',new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size',new DefaultValuePipe(5), ParseIntPipe) size: number
  ): Promise<PaginateEvent> {
    return await this.eventService.findEventsByUser(userId, {
      pageNumber: page,
      pageSize: size,
      totalCount: true
    });
  }
}
