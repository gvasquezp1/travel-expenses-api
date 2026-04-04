import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Permission } from './permission.entity';
import { UserRole } from '../../user-role/entities/user-role.entity';

@Entity('role_permissions')
@Unique(['roleId', 'permissionId'])
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleId: string;

  @Column()
  permissionId: string;

  @ManyToOne(() => UserRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: UserRole;

  @ManyToOne(() => Permission, (p) => p.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;

  @Column({ default: true })
  hasAccess: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
