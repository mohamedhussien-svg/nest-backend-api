import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  email: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @OneToOne(() => ProfileEntity,(profile)=>profile.user)
  @JoinColumn()
  profile: ProfileEntity;

}
