import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cost_center_approvers')
export class CostCenterApprover {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  costCenterId: string;

  @Column()
  costCenterName: string;

  @Column()
  approverId: string;

  @Column()
  approverName: string;

  @Column()
  approverEmail: string;

  @Column({ default: false })
  isPrimary: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
