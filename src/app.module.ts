import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PricelistsModule } from './pricelists/pricelists.module';
import { VehicleBrandsModule } from './vehicle-brands/vehicle-brands.module';
import { VehicleModelsModule } from './vehicle-models/vehicle-models.module';
import { VehicleTypesModule } from './vehicle-types/vehicle-types.module';
import { VehicleYearsModule } from './vehicle-years/vehicle-years.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [UsersModule, PricelistsModule, VehicleBrandsModule, VehicleModelsModule, VehicleTypesModule, VehicleYearsModule, VehicleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
