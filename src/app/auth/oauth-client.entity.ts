import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('oauth_clients')
export class OauthClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  clientId: string;

  @Column()
  clientSecret: string;

  @Column('simple-array')
  redirectUris: string[];

  @Column({ default: true })
  enabled: boolean;

  @Column({ nullable: true })
  name: string;

  @Column('simple-array', { nullable: true })
  scopes: string[];
}
