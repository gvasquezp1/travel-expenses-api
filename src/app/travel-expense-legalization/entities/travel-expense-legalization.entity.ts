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

  @Column('uuid', { nullable: true })
  travelExpenseRequestId: string | null;

  @Column('uuid', { nullable: true })
  travelExpenseRequestDetailId: string | null;

  @Column({ type: 'int' })
  dayNumber: number;

  @Column('uuid')
  categoryId: string;

  @Column()
  categoryName: string;

  @Column({ type: 'int', default: 1 })
  categoryConsecutive: number;

  @Column({ type: 'varchar', nullable: true })
  supplierNit: string | null;

  @Column()
  supplierName: string;

  @Column({ type: 'varchar', nullable: true })
  invoiceNumber: string | null;

  @Column('decimal', { precision: 10, scale: 2 })
  invoiceAmount: number;

  @Column('uuid', { nullable: true })
  taxIndicatorId: string | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  taxAmount: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  tipAmount: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  consumptionTaxAmount: number | null;

  @Column({ type: 'varchar', nullable: true })
  fileUrl: string | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  amountApproved: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  balance: number | null;

  @Column({ default: false })
  isOverAuthorized: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  exceededAmount: number | null;

  @Column({ type: 'varchar', nullable: true })
  urlPath: string | null;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ type: 'varchar', nullable: true })
  approvedBy: string | null;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  accountingReviewNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
