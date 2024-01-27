import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, Logger, NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post, Query
} from '@nestjs/common';
import { CreateEventDto } from './dto/create.event.dto';
import { UpdateEventDto } from './dto/update.event.dto';
import { Event } from './event';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee';
import { EventService } from './event.service';
import { ListEventFilter } from './dto/list.event.filter';
import { PaginationResult } from '../pagination/paginator';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
    @InjectRepository(Attendee) private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventService: EventService
  ) {
  }

  @Get()
  async findAll(@Query() filter: ListEventFilter): Promise<PaginationResult<Event>> {
    this.logger.log('findAll started');
    const events = await this.eventService.findEventsByFilter(filter);
    this.logger.log(events);
    return events;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Event | undefined> {

    return await this.eventService.getEventById(id);
    // return await this.repository.findOne({
    //   where: { id: id },
    //   //loadEagerRelations: true,
    //   relations: ['attendees']
    // });

  }

  @Post()
  async create(@Body() input: CreateEventDto): Promise<Event> {
    const event: Event = {
      ...input,
      when: new Date(input.when),
      id: null,
      attendees: []
    };
    return await this.repository.save(event);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number,
               @Body() input: UpdateEventDto): Promise<Event> {
    const entity = await this.repository.findOneBy({ id: id });
    entity.name = input.name;
    entity.address = input.address;
    entity.when = input.when ? new Date(input.when) : entity.when;
    entity.description = input.description;
    return await this.repository.save(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number) {
    const deleteResult = await this.eventService.deleteEvent(id);
    if (deleteResult?.affected !== 1) {
      throw new NotFoundException(`event id not found id: [${id}]`);
    }
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
  async addEventAttendees(@Param('id') id: number) {
    const event = await this.repository.findOne({ where: { id: id }, relations: ['attendees'] });
    const attendee: Attendee = new Attendee();
    attendee.name = 'Mohamed will attend';
    event.attendees.push(attendee);
    await this.repository.save(event);
  }
}
