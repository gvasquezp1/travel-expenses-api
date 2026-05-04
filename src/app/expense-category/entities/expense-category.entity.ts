import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Line } from '../../lines/entities/line.entity';
import { TaxIndicator } from '../../tax-indicator/entities/tax-indicator.entity';

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

  @Column({ nullable: true })
  lineId: string;

  @ManyToOne(() => Line, { nullable: true })
  @JoinColumn({ name: 'lineId' })
  line: Line;

  @Column({ nullable: true })
  taxIndicatorId: string;

  @ManyToOne(() => TaxIndicator, { nullable: true })
  @JoinColumn({ name: 'taxIndicatorId' })
  taxIndicator: TaxIndicator;
}
