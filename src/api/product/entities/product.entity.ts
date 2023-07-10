import { Category } from "src/api/category/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'varchar', length: 30, nullable: false })
    name: string

    @Column({ type: 'varchar', length: 200, nullable: false })
    description: string

    @Column({ type: 'simple-array', nullable: false })
    image_url: string[]

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number

    @Column({ type: 'int', nullable: false, default: 1 })
    qty: number

    @Column({ type: 'boolean', nullable: false, default: 1 })
    is_active: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}
