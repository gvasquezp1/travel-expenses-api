import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role_expense_category_limits')
export class RoleLineLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lineId: string;

  @Column()
  userRoleId: string;

  @Column()
  expenseCategoryId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  maxAmount: number;

  @Column({ default: false })
  locked: boolean;
}
