import { Controller, Post, Body, Req, Get, Query  } from '@nestjs/common';
import { Request } from 'express';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/createVehicle.dto';

@Controller('vehicle')
export class VehicleController {
    constructor(
        private readonly vehicleService: VehicleService,
    ) {}

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 3,
    ) {
        return this.vehicleService.findAll(page, limit);
    }

    @Get('search')
    async search(
        @Query() query: any
    ): Promise<any> {
        const { page = 1, limit = 10, ...otherParams } = query;
        return this.vehicleService.findOne({
            page,
            limit,
            ...otherParams,
          });
    }

    @Post('create')
    async createVehicle(@Body() createVehicleDto: CreateVehicleDto, @Req() req: Request) {
        return this.vehicleService.create(createVehicleDto, req);
    }
}
