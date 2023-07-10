import { User } from 'src/api/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  name: string;

  @Column({ type: 'bigint', nullable: true, unique: true })
  phone: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  addressline: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  state: string;

  @Column({ type: 'int', nullable: false })
  pincode: number;

  @Column({ type: 'boolean', nullable: false, default: 1 })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
