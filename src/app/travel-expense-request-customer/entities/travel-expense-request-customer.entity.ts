import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('travel_expense_request_customers')
export class TravelExpenseRequestCustomer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  travelExpenseRequestId: string;

  @Column('uuid')
  customerId: string;

  @Column()
  sapCode: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
