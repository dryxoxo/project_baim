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

  async create(name: string, id_brand: string, req: any): Promise<vehicle_types> {
    try {
      if (req['user'].role !== true) {
        throw new UnauthorizedException('Only admin can create vehicle type');
      }

      const brand = await this.vehicleBrandsRepository.findOne({ where: { id_brand: id_brand } });
      if (!brand) {
        throw new NotFoundException(`Brand with id ${id_brand} not found`);
      }

      const vehicleType = this.vehicleTypesRepository.create({
        name,
        id_brand: brand,
      });
      return this.vehicleTypesRepository.save(vehicleType);
    } catch (error) {
      throw error;
    }
  }

  async delete(id_type: string, req: Request): Promise<any> {
    try {
      if (req['user'].role !== true) {
        throw new UnauthorizedException('Only admin can delete vehicle type');
      }

      const vehicleType = await this.vehicleTypesRepository.findOne({
        where: { id_type },
      });

      if (!vehicleType) {
        throw new NotFoundException('Vehicle type not found');
      }
  
      await this.vehicleTypesRepository.delete(id_type);
  
      return {
        message: 'Vehicle type deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  
  
}
