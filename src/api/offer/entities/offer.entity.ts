import { Category } from "src/api/category/entities/category.entity";
import { Product } from "src/api/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @OneToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'int', nullable: false, })
    discount_percentage: number

    @Column({ type: 'int', nullable: false })
    original_price: number

    @Column({ type: 'date' })
    start_date: Date

    @Column({ type: 'date' })
    end_date: Date

    @Column({ type: 'boolean', nullable: false, default: 1 })
    is_active: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
