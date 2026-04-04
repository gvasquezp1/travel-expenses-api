import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity('modules')
export class SystemModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @OneToMany(() => Permission, (p) => p.module)
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;
}
