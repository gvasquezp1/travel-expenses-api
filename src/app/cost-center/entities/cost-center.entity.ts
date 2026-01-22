import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('cost_centers')
export class CostCenter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ length: 120 })
    centerCode: string;

    @Column({ length: 255 })
    description: string;

    // @Column('decimal', { precision: 10, scale: 2 })
    // budget: number;

    // @Column('decimal', { precision: 10, scale: 2 })
    // spent: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
