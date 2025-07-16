import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Appointment } from './appointment.entity';
import { Gender } from '../enums/gender.enum';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  doctor_id: string;

  @Column({ unique: true })
  user_id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  specialization: string;

  @Column({ type: 'jsonb', nullable: true, comment: 'Stores doctor availability rules' })
  availability_schedule: any;

  @Column("text", { array: true, nullable: true })
  services: string[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}