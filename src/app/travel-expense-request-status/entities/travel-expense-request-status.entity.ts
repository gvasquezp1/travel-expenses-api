import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('travel_expense_request_statuses')
export class TravelExpenseRequestStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  travelExpenseRequestId: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'varchar', length: 80 })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  changedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
