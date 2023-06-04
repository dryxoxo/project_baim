import { vehicle_types } from 'src/vehicle-types/entity/vehicle-types.entity';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn, OneToMany} from 'typeorm';

@Entity()
export class vehicle_brands extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id_brand: string;

    @OneToMany(() => vehicle_types, vehicleType => vehicleType.id_brand)
    vehicleTypes: vehicle_types[];

    @Column()
    name: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

}