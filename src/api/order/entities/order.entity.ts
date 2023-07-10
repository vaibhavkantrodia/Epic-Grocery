import { Address } from 'src/api/address/entities/address.entity';
import { Product } from 'src/api/product/entities/product.entity';
import { User } from 'src/api/user/entities/user.entity';
import { ORDERSTATUS } from 'src/helpers/order-status.enum';
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
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  order_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  order_datetime: Date;

  @Column({ type: 'enum', enum: ORDERSTATUS, default: ORDERSTATUS.PENDING })
  status: ORDERSTATUS;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', nullable: false, default: 1 })
  qty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_price: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Address, (address) => address.id)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
