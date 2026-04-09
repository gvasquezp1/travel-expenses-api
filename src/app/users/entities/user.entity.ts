import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 160 })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  lineId: string;

  @Column()
  roleId: string;

  @Column({ default: false })
  locked: boolean;

  @Column({ default: false })
  isSystemAdmin: boolean;

  @Column({ nullable: true })
  cardNumber: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
