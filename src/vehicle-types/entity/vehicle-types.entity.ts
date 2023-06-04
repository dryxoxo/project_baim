import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn } from 'typeorm';
import { vehicle_brands } from '../../vehicle-brands/entity/vehicle-brands.entity';
@Entity()
export class vehicle_types extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id_type: string;

    @Column()
    name: string;

    @ManyToOne(() => vehicle_brands, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_brand' })
    id_brand: vehicle_brands;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

}