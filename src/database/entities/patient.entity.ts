import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { PatientDetails } from './patient-details.entity';
import { Appointment } from './appointment.entity';
import { Gender } from '../enums/gender.enum';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  patient_id: string;

  @Column({ unique: true })
  user_id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: true })
  weight: number;

  @OneToOne(() => PatientDetails, (details) => details.patient, {
    cascade: true,
  })
  details: PatientDetails;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}
