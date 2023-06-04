import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { vehicle_types } from '../vehicle-types/entity/vehicle-types.entity';
  import { Repository } from 'typeorm';
  import { vehicle_brands } from '../vehicle-brands/entity/vehicle-brands.entity';
  import { vehicle_models } from '../vehicle-models/entity/vehicle-models.entity';
  import { vehicle_years } from '../vehicle-years/entity/vehicle-years.entity';
  import { pricelist } from '../pricelists/entity/pricelists.entity';
  import { Request } from 'express';
@Injectable()
export class VehicleModelsService {
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
      
      async updateVehicleModel(id_model: string, name: string, req: Request): Promise<any> {
        try {
          if (req['user'].role !== true) {
            throw new UnauthorizedException('Only admin can update vehicle model');
          }
          const vehicleModel = await this.vehicleModelsRepository.findOne({
            where: { id_model },
          });
          if (!vehicleModel) {
            throw new NotFoundException('Vehicle model not found');
          }
          vehicleModel.name = name;
          await this.vehicleModelsRepository.save(vehicleModel);
          return {
            message: 'Vehicle model updated successfully',
          };
        } catch (error) {
          throw new InternalServerErrorException(error.message);
        }
      }
}
