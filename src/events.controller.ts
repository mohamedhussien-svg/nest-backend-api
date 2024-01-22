import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CreateEventDto } from './create.event.dto';
import { UpdateEventDto } from './update.event.dto';
import { EventEntity } from './event.entity';

@Controller('/events')
export class EventsController {
  private events: EventEntity[] = [];

  constructor() {
  }

  @Get()
  findAll(): EventEntity[] {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id: string): EventEntity {
    return this.events
      .find(x => x.id === parseInt(id));
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    const event: EventEntity = {
      ...input,
      when: new Date(input.when),
      id: this.events.length + 1
    };
    this.events.push(event);
    return event;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateEventDto): EventEntity {
    const index = this.events.findIndex(x => x.id === parseInt(id));
    const entity: EventEntity = this.events[index];
    const updatedEvent: EventEntity = {
      ...this.events[index],
      ...input,
      when: new Date(input.when)
    };
    this.events[index] = updatedEvent;
    return this.events[index];
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.events.filter(x => x.id !== parseInt(id));
  }
}
