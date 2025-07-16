import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';

@Entity('patient_details')
export class PatientDetails {
  @PrimaryGeneratedColumn('uuid')
  details_id: string;

  @Column({ unique: true })
  patient_id: string;

  @OneToOne(() => Patient, (patient) => patient.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: 'Height in meters',
  })
  height: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: 'Weight in kilograms',
  })
  weight: number;

  @Column({ type: 'text', nullable: true })
  medical_history: string;
}
