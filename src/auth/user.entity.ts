import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { Event } from '../events/event';
import { Expose } from 'class-transformer';
import { Attendee } from '../events/attendee';

@Entity()
export class UserEntity {

  @Expose()
  @PrimaryGeneratedColumn()
  id: number;
  @Expose()
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @Expose()
  @Column({ unique: true })
  email: string;
  @Expose()
  @Column()
  firstName: string;
  @Expose()
  @Column()
  lastName: string;
  @OneToOne(() => ProfileEntity)
  @JoinColumn()
  profile: ProfileEntity;
  @OneToMany(() => Event, (events) => events.organizer)
  events: Event[];
  @OneToMany(() => Attendee, (attendee) => attendee.user)
  attendees: Attendee[];


}
