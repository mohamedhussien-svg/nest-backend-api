import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  name: string;
  @Column()
  description: string;
  @Column()
  when: Date;
  @Column()
  address: string;

  @OneToMany(() => Attendee,
    (attendee) => attendee.event,
    {
      eager: false,
      cascade: ['insert', 'update']
    })
  attendees: Attendee[];
  attendeeCount?: number;
  attendeeAcceptedCount?: number;
  attendeeMaybeCount?: number;
  attendeeRejectedCount?: number;

}
