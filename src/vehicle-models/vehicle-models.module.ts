import { Module } from '@nestjs/common';
import { VehicleModelsController } from './vehicle-models.controller';
import { VehicleModelsService } from './vehicle-models.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { vehicle_brands } from '../vehicle-brands/entity/vehicle-brands.entity';
import { vehicle_types } from '../vehicle-types/entity/vehicle-types.entity';
import { vehicle_models } from '../vehicle-models/entity/vehicle-models.entity';
import { vehicle_years } from '../vehicle-years/entity/vehicle-years.entity';
import { pricelist } from '../pricelists/entity/pricelists.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      vehicle_brands,
      vehicle_types,
      vehicle_models,
      vehicle_years,
      pricelist,
    ]),
  ],
  controllers: [VehicleModelsController],
  providers: [VehicleModelsService]
})
export class VehicleModelsModule {}
