import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  age: number;
  @OneToOne(() => UserEntity, (user) => user.profile, {
    cascade: true,
    nullable: false
  })
  @JoinColumn()
  user: UserEntity;
}
