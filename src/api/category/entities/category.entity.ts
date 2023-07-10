import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
    name: string

    @Column({ type: 'varchar', length: 200, nullable: false })
    image_url: string

    @Column({ type: 'boolean', nullable: false, default: 1 })
    is_active: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
