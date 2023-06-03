import { Module } from '@nestjs/common';
import { VehicleYearsController } from './vehicle-years.controller';
import { VehicleYearsService } from './vehicle-years.service';

@Module({
  controllers: [VehicleYearsController],
  providers: [VehicleYearsService]
})
export class VehicleYearsModule {}
