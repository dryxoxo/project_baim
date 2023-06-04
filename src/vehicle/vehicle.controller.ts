import { Controller, Post, Body, Req  } from '@nestjs/common';
import { Request } from 'express';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/createVehicle.dto';

@Controller('vehicle')
export class VehicleController {
    constructor(
        private readonly vehicleService: VehicleService,
    ) {}

    @Post('create')
    async createVehicle(@Body() createVehicleDto: CreateVehicleDto, @Req() req: Request) {
        return this.vehicleService.create(createVehicleDto, req);
    }
}
