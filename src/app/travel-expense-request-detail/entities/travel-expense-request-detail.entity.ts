import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('travel_expense_request_details')
export class TravelExpenseRequestDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  travelExpenseRequestId: string;

  @Column('uuid')
  categoryId: string;

  @Column()
  categoryName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amountRequested: number;

  @Column('decimal', { precision: 10, scale: 2 })
  categoryLimit: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  amountSubmitted: number;

  @Column({ default: false })
  approved: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  amountApproved: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
