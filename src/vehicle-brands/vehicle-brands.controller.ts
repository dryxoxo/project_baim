import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Param,
  Delete,
  Patch
} from '@nestjs/common';
import { Request } from 'express';
import { VehicleBrandsService } from './vehicle-brands.service';
@Controller('vehicle-brands')
export class VehicleBrandsController {
  constructor(private readonly vehicleBrandsService: VehicleBrandsService) {}

  @Patch('update/:id_brand')
  async update(
    @Param('id_brand') id_brand: string,
    @Body('nameBrand') name: string,
    @Req() req: Request,
  ): Promise<any> {
    return this.vehicleBrandsService.update(id_brand, name, req);
  }

  @Delete('delete/:id_brand')
  async deleteBrand(@Param('id_brand') id_brand: string, @Req() req: any): Promise<any> {
    return this.vehicleBrandsService.delete(id_brand, req);
  }
}
