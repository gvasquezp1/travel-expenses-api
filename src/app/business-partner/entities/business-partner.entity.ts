import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('business_partners')
export class BusinessPartner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sapCode: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  customerType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
