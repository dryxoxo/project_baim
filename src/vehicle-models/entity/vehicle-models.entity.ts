import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn } from 'typeorm';
import { vehicle_types } from '../../vehicle-types/entity/vehicle-types.entity';

@Entity()
export class vehicle_models extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id_model: string;

    @Column()
    name: string;

    @ManyToOne(() => vehicle_types, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_type' })
    id_type: vehicle_types;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

}