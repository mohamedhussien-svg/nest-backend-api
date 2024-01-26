import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, Logger, NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from '@nestjs/common';
import { CreateEventDto } from './create.event.dto';
import { UpdateEventDto } from './update.event.dto';
import { Event } from './event';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(@InjectRepository(Event) private readonly repository: Repository<Event>) {
  }

  @Get()
  async findAll(): Promise<Event[]> {
    this.logger.log('findAll started');
    const events = await this.repository.find();
    this.logger.log(events);
    this.logger.debug(`events ${events.length}`);
    return events;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Event> {
    return await this.repository.findOneBy({ id: id });
  }

  @Post()
  async create(@Body() input: CreateEventDto): Promise<Event> {
    const event: Event = {
      ...input,
      when: new Date(input.when),
      id: null
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
    const entity = await this.repository.findOneBy({ id: id });
    if (!entity){
      throw new NotFoundException('event id not found ya mohamed');
    }
    await this.repository.remove(entity);
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
}
