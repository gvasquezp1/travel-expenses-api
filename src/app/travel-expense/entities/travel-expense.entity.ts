import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('travel_expenses')
export class TravelExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userEmail: string;

  @Column()
  userName: string;

  @Column()
  reason: string;

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

  @Column()
  statusId: string;

  @Column()
  statusName: string;

  @Column()
  centerCode: string;

  @Column()
  centerName: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  taxes: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  tips: number;

  @Column()
  paymentMethod: string;

  @Column({ default: false })
  refundable: boolean;

  @Column({ nullable: true })
  supplierId: string;

  @Column({ nullable: true })
  supplierName: string;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ nullable: true })
  file1: string;

  @Column({ nullable: true })
  file2: string;

  @Column({ nullable: true })
  file3: string;

  @Column({ nullable: true })
  rejectedReason: string;

  @Column()
  createdBy: string;


  @Column()
  createdByName: string;

  @Column({ nullable: true })
  editedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  locked: boolean;
}