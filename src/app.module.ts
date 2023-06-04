import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PricelistsModule } from './pricelists/pricelists.module';
import { VehicleBrandsModule } from './vehicle-brands/vehicle-brands.module';
import { VehicleModelsModule } from './vehicle-models/vehicle-models.module';
import { VehicleTypesModule } from './vehicle-types/vehicle-types.module';
import { VehicleYearsModule } from './vehicle-years/vehicle-years.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { MiddlewareConsumer } from '@nestjs/common';
import { JwtMiddleware } from './middleware/JwtMiddleware.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UsersModule, PricelistsModule, VehicleBrandsModule, VehicleModelsModule, VehicleTypesModule, VehicleYearsModule, VehicleModule],
  controllers: [],
  providers: [JwtMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('vehicle', 'vehicle-brands', 'vehicle-types', 'vehicle-models');
  }
}
