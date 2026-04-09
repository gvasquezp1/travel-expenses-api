import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('travel_expense_legalizations')
export class TravelExpenseLegalization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  travelExpenseRequestId: string;

  @Column('uuid')
  travelExpenseRequestDetailId: string;

  @Column({ type: 'int' })
  dayNumber: number;

  @Column('uuid')
  categoryId: string;

  @Column()
  categoryName: string;

  @Column({ nullable: true })
  supplierNit: string;

  @Column()
  supplierName: string;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  invoiceAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  taxAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  tipAmount: number;

  @Column({ nullable: true })
  fileUrl: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  amountApproved: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  balance: number;

  @Column({ nullable: true })
  urlPath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
