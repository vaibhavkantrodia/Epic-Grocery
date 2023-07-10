import { ROLE } from 'src/helpers/role.enum';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  last_name: string;

  @Column({ type: 'bigint', nullable: false, unique: true })
  phone: number;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.USER })
  role: ROLE;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reset_password_token: string

  @Column({ type: 'timestamp', nullable: true })
  reset_password_token_expire_time: Date;

  @Column({ type: 'boolean', default: 1 })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
