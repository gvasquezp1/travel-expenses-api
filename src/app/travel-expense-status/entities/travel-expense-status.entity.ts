import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TravelExpenseStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ default: false })
  locked: boolean;
}
