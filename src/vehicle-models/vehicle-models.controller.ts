import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';
import { VehicleModelsService } from './vehicle-models.service';
@Controller('vehicle-models')
export class VehicleModelsController {
  constructor(private readonly vehicleModelsService: VehicleModelsService) {}

  @Patch('update/:id_model')
  updateVehicleModel(
    @Param('id_model') id_model: 'string',
    @Body() updateData: any,
    @Req() req: Request,
  ): Promise<any> {
    const { nameModel, price, year } = updateData;
    return this.vehicleModelsService.updateVehicleModel(
      id_model,
      nameModel,
      price,
      year,
      req,
    );
  }

  @Delete('delete/:id_model')
  async delete(
    @Param('id_model') id_model: string,
    @Req() req: Request,
  ): Promise<any> {
    return this.vehicleModelsService.deleteVehicleModel(id_model, req);
  }

  @Post('create/:id_type')
  async create(
    @Param('id_type') id_type: string,
    @Body('nameModel') name: string,
    @Body('price') price: number,
    @Body('year') year: string,
    @Req() req: Request,
  ): Promise<any> {
    return this.vehicleModelsService.createVehicleModel(
      id_type,
      name,
      price,
      year,
      req,
    );
  }
}
