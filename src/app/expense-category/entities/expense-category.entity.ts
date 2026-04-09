import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExpenseCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  account: string;

  @Column({ default: false })
  locked: boolean;
}