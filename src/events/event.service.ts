import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event';
import { AttendeeStatus } from './attendee.status.enum';
import { ListEventFilter, When } from './dto/list.event.filter';
import { paginate, PaginationResult } from '../pagination/paginator';
import { CreateEventDto } from './dto/create.event.dto';
import { UserEntity } from '../auth/user.entity';
import { UpdateEventDto } from './dto/update.event.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>) {
  }


  public async getEventById(id: number): Promise<Event | undefined> {
    const queryBuilder = this.getEventWithAttendeeCount()
      .andWhere('e.id=:id', { id: id });
    this.logger.debug(queryBuilder.getQuery());
    return await queryBuilder.getOne();
  }

  private getBasicQueryBuilder(): SelectQueryBuilder<Event> {
    return this.eventRepository.createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  private getEventWithAttendeeCount(): SelectQueryBuilder<Event> {
    return this.getBasicQueryBuilder()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAcceptedCount',
        'e.attendees',
        'attendee',
        (qb) => qb.where('attendee.attendeeStatus=:attendeeStatus', { attendeeStatus: AttendeeStatus.Accepted }))
      .loadRelationCountAndMap(
        'e.attendeeMaybeCount',
        'e.attendees',
        'attendee',
        (qb) => qb.where('attendee.attendeeStatus=:attendeeStatus', { attendeeStatus: AttendeeStatus.MayBe }))
      .loadRelationCountAndMap(
        'e.attendeeRejectedCount',
        'e.attendees',
        'attendee',
        (qb) => qb.where('attendee.attendeeStatus=:attendeeStatus', { attendeeStatus: AttendeeStatus.Rejected }));
  }

  async findEventsByFilter(filter: ListEventFilter): Promise<PaginationResult<Event>> {
    this.logger.debug('findEventsByFilter {}', filter);
    const queryBuilder: SelectQueryBuilder<Event> = this.getEventWithAttendeeCount();
    let eventSelectQueryBuilder: SelectQueryBuilder<Event>;
    if (!filter.when) {
      eventSelectQueryBuilder = queryBuilder;
    }
    if (filter.when == When.Today) {
      eventSelectQueryBuilder = queryBuilder.andWhere(`e.when >= CURDATE() and e.when <=  CURDATE() + INTERVAL 1 DAY `);
    }
    if (filter.when == When.Tomorrow) {
      eventSelectQueryBuilder = queryBuilder.andWhere(`e.when >= CURDATE() + INTERVAL 1 DAY and e.when <=  CURDATE() + INTERVAL 2 DAY `);
    }
    if (filter.when == When.ThisWeek) {
      eventSelectQueryBuilder = queryBuilder.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(),1)`);
    }
    if (filter.when == When.NextWeek) {
      eventSelectQueryBuilder = queryBuilder.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(),1)+1`);
    }

    this.logger.debug(eventSelectQueryBuilder.getQuery());
    return await paginate({
      pageSize: filter.size,
      pageNumber: filter.page,
      totalCount: true
    }, eventSelectQueryBuilder);
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventRepository.createQueryBuilder('e')
      .delete()
      .where('id=:id', { id: id })
      .execute();
  }

  async create(input: CreateEventDto, user: UserEntity) {
    const event: Event = {
      ...input,
      when: new Date(input.when),
      id: null,
      attendees: [],
      organizer: user,
      organizerId: user.id
    };
    return await this.eventRepository.save(event);
  }

  async update(id: number, input: UpdateEventDto, user: UserEntity) {
    const entity = await this.eventRepository.findOneBy({ id: id });
    if (entity.organizerId !== user.id) {
      throw new ForbiddenException('you are not authorized to update this event');
    }
    entity.name = input.name;
    entity.address = input.address;
    entity.when = input.when ? new Date(input.when) : entity.when;
    entity.description = input.description;
    return await this.eventRepository.save(entity);
  }

  async remove(id: number, user: UserEntity) {
    const entity = await this.eventRepository.findOneBy({ id: id });
    if (!entity) {
      throw new NotFoundException(`event id not found id: [${id}]`);
    }
    if (entity.organizerId !== user.id) {
      throw new ForbiddenException('you are not authorized to update this event');
    }
    const deleteResult = await this.deleteEvent(id);
    if (deleteResult?.affected !== 1) {
      throw new NotFoundException(`event id not found id: [${id}]`);
    }
  }
}
