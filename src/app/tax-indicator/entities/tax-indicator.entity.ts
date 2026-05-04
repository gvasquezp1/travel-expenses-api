import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('tax_indicators')
export class TaxIndicator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 120 })
  code: string;

  @Column({ length: 255 })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
