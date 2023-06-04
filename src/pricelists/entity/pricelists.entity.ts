import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn } from 'typeorm';
import { vehicle_years } from '../../vehicle-years/entity/vehicle-years.entity';
import { vehicle_models } from 'src/vehicle-models/entity/vehicle-models.entity';

@Entity()
export class pricelist extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id_price: string;

    @ManyToOne(() => vehicle_years, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_year' })
    id_year: vehicle_years;

    @Column()
    price: number;

    @ManyToOne(() => vehicle_models, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_model' })
    id_model: vehicle_models;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

}