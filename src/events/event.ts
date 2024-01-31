import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee';
import { UserEntity } from '../auth/user.entity';
import { Expose } from 'class-transformer';
import { PaginationResult } from '../pagination/paginator';

@Entity()
export class Event {
  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  @Column({ length: 100 })
  @Expose()
  name: string;
  @Expose()
  @Column()
  description: string;
  @Expose()
  @Column()
  when: Date;
  @Expose()
  @Column()
  address: string;
  @Expose()
  @OneToMany(() => Attendee,
    (attendee) => attendee.event,
    {
      eager: false,
      cascade: ['insert', 'update']
    })
  attendees: Attendee[];

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.events, {
    nullable: true
  })
  @JoinColumn({ name: 'organizerId' })
  organizer: UserEntity;
  @Column({ nullable: true })
  organizerId: number;

  attendeeCount?: number;
  attendeeAcceptedCount?: number;
  attendeeMaybeCount?: number;
  attendeeRejectedCount?: number;

}

export type  PaginateEvent = PaginationResult<Event>

