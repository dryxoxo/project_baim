import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService]
})
export class VehicleModule {}
