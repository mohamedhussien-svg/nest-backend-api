import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Attendee, PaginateAttendee } from './attendee';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginationOptions } from '../pagination/paginator';
import { CreateUpdateAttendeeDto } from './dto/create.update.attendee.dto';

@Injectable()
export class AttendeeService {
  constructor(@InjectRepository(Attendee) private readonly attendeeRepo: Repository<Attendee>) {
  }


  public async findAttendeeByUser(userId: number, options: PaginationOptions): Promise<PaginateAttendee> {
    const attendeeSelectQueryBuilder = this.getBasicAttendeeQuery()
      .where('a.userId=:userId', { userId: userId });
    return await paginate(options, attendeeSelectQueryBuilder);
  }


  public async createOrUpdateAttendee(input: CreateUpdateAttendeeDto, userId: number, eventId: number): Promise<Attendee> {
    const attendee = await this.getAttendee(eventId, userId);
    attendee.userId = userId;
    attendee.eventId = eventId;
    attendee.attendeeStatus = input.status;
    return await this.attendeeRepo.save(attendee);

  }

  public async getAttendee(eventId: number, userId: number): Promise<Attendee> {
    return await this.attendeeRepo.findOneBy({ eventId: eventId, userId: userId }) ?? new Attendee();
  }

  private getBasicAttendeeQuery(): SelectQueryBuilder<Attendee> {
    return this.attendeeRepo.createQueryBuilder('a')
      .orderBy('a.id', 'DESC');
  }


}
