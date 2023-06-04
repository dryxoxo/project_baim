import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { VehicleTypesService } from './vehicle-types.service';

@Controller('vehicle-types')
export class VehicleTypesController {
  constructor(private readonly vehicleTypesService: VehicleTypesService) {}

  @Post('create/:id_brand')
  async create(
    @Param('id_brand') id_brand: string,
    @Body('nameType') name: string,
    @Req() req: Request,
  ): Promise<any> {
    return this.vehicleTypesService.create(name, id_brand, req);
  }

  @Post('update/:id_type')
  async update(
    @Param('id_type') id_type: string,
    @Body('nameType') name: string,
    @Req() req: Request,
  ): Promise<any> {
    return this.vehicleTypesService.update(id_type, name, req);
  }

  @Delete('delete/:id_type')
  async delete(
    @Param('id_type') id_type: string,
    @Req() req: Request,
  ): Promise<any> {
    return this.vehicleTypesService.delete(id_type, req);
  }
}
