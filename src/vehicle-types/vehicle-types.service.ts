import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { vehicle_types } from './entity/vehicle-types.entity';
import { Repository } from 'typeorm';
import { vehicle_brands } from '../vehicle-brands/entity/vehicle-brands.entity';
import { vehicle_models } from '../vehicle-models/entity/vehicle-models.entity';
import { vehicle_years } from '../vehicle-years/entity/vehicle-years.entity';
import { pricelist } from '../pricelists/entity/pricelists.entity';
import { Request } from 'express';

@Injectable()
export class VehicleTypesService {
  constructor(
    @InjectRepository(vehicle_brands)
    private vehicleBrandsRepository: Repository<vehicle_brands>,

    @InjectRepository(vehicle_types)
    private vehicleTypesRepository: Repository<vehicle_types>,

    @InjectRepository(vehicle_models)
    private vehicleModelsRepository: Repository<vehicle_models>,

    @InjectRepository(vehicle_years)
    private vehicleYearsRepository: Repository<vehicle_years>,

    @InjectRepository(pricelist)
    private pricelistRepository: Repository<pricelist>,
  ) {}

  async update(id_type: string, name: string, req: Request): Promise<any> {
    try {
      if (req['user'].role !== true) {
        throw new UnauthorizedException('Only admin can update vehicle type');
      }
      const vehicleType = await this.vehicleTypesRepository.findOne({
        where: { id_type },
      });
      if (!vehicleType) {
        throw new NotFoundException('Vehicle type not found');
      }
      vehicleType.name = name;
      await this.vehicleTypesRepository.save(vehicleType);
      return {
        message: 'Vehicle type updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
