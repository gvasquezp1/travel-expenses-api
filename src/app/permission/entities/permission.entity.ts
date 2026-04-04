import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { SystemModule } from './system-module.entity';
import { RolePermission } from './role-permission.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  moduleId: string;

  @ManyToOne(() => SystemModule, (m) => m.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' })
  module: SystemModule;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  code: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions: RolePermission[];

  @CreateDateColumn()
  createdAt: Date;
}
