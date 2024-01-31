import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event';
import { AttendeeStatus } from './attendee.status.enum';
import { UserEntity } from '../auth/user.entity';
import { Expose } from 'class-transformer';
import { PaginationResult } from '../pagination/paginator';

@Entity()
export class Attendee {

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: false
  })
  @Expose()
  event: Event;

  @Expose()
  @Column({
    name: 'event_id'
  })
  eventId:number;

  @Column('enum', {
    enum: AttendeeStatus,
    name: 'attendee_status',
    default: AttendeeStatus.Accepted
  })
  @Expose()
  attendeeStatus: AttendeeStatus;
  @ManyToOne(() => UserEntity, (user) => user.attendees)
  user: UserEntity;

  @Column()
  userId: number;
}

export type PaginateAttendee = PaginationResult<Attendee>;

