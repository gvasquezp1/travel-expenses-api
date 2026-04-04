import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('line_request_limits')
export class LineRequestLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lineId: string;

  @Column('int')
  maxRequests: number;
}
