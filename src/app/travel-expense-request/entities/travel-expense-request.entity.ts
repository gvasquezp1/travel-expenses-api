import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('travel_expense_requests')
export class TravelExpenseRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true, nullable: true })
  documentNumber: number;

  @Column('uuid')
  requestedForUserId: string;

  @Column()
  requestedForUserName: string;

  @Column({ type: 'date' })
  docDate: Date;

  @Column()
  originCountry: string;

  @Column()
  originCity: string;

  @Column()
  destinationCountry: string;

  @Column()
  destinationCity: string;

  @Column()
  categoryId: string;

  @Column()
  categoryName: string;

  @Column('uuid')
  costCenterId: string;

  @Column()
  costCenterName: string;

  @Column()
  reason: string;

  @Column({ nullable: true })
  details: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  paymentMethodId: string;

  @Column()
  paymentMethodName: string;

  @Column('uuid')
  createdBy: string;

  @Column()
  createdByName: string;

  @Column({ default: false })
  locked: boolean;

  @Column({ nullable: true })
  customerId: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true, type: 'int' })
  numberOfDays: number;

  @Column({ type: 'int', default: 0 })
  legalizationConsecutive: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}