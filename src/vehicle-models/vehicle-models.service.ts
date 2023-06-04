import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { vehicle_types } from '../vehicle-types/entity/vehicle-types.entity';
import { Repository, Equal, Raw } from 'typeorm';
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

  async deleteVehicleModel(id_model: string, req: Request): Promise<any> {
    try {
      if (req['user'].role !== true) {
        throw new UnauthorizedException('Only admin can delete vehicle model');
      }
      const vehicleModel = await this.vehicleModelsRepository.findOne({
        where: { id_model },
      });
      if (!vehicleModel) {
        throw new NotFoundException('Vehicle model not found');
      }
      await this.vehicleModelsRepository.delete(id_model);
      return {
        message: 'Vehicle model deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // async updateVehicleModel(
  //   id_model: string,
  //   nameBrand: string,
  //   price: number,
  //   year: string,
  //   req: any,
  // ): Promise<any> {
  //   const vehicleModel = await this.vehicleModelsRepository.findOne({
  //     where: { id_model },
  //   });
    

  //   const pricelist = await this.pricelistRepository.findOne({
  //     where: {
  //       id_model: Raw(alias => `${alias} = :id`, { id: id_model }),
  //     },
  //     relations: ['id_year', 'id_model'],
  //   });
    
  //   vehicleModel.name = nameBrand;
  //   pricelist.price = price;
  //   pricelist.id_year.year = year;

  //   return pricelist;
  // }

  async updateVehicleModel(
    id_model: string,
    name: string,
    price: number,
    year: string,
    req: any
  ): Promise<any> {
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
  
      if (name) {
        vehicleModel.name = name;
      }
  
      let pricelist = await this.pricelistRepository.findOne({
        where: {
          id_model: Raw(alias => `${alias} = :id`, { id: id_model }),
        },
        relations: ['id_year', 'id_model'],
      });
  
      if (price) {
        if (pricelist) {
          pricelist.price = price;
          await this.pricelistRepository.save(pricelist);
        } else {
          const vehicleYear = await this.vehicleYearsRepository.findOne({ where: { year } });
          if (!vehicleYear) {
            throw new NotFoundException('Vehicle year not found');
          }
  
          pricelist = this.pricelistRepository.create({
            price,
            id_year: vehicleYear,
            id_model: vehicleModel,
          });
          await this.pricelistRepository.save(pricelist);
        }
      }
  
      if (!pricelist && year) {
        const vehicleYear = await this.vehicleYearsRepository.findOne({ where: { year } });
        if (!vehicleYear) {
          // Create new vehicle year if it doesn't exist
          const newVehicleYear = this.vehicleYearsRepository.create({ year });
          await this.vehicleYearsRepository.save(newVehicleYear);
  
          pricelist = this.pricelistRepository.create({
            price: null,
            id_year: newVehicleYear,
            id_model: vehicleModel,
          });
          await this.pricelistRepository.save(pricelist);
        } else {
          pricelist = this.pricelistRepository.create({
            price: null,
            id_year: vehicleYear,
            id_model: vehicleModel,
          });
          await this.pricelistRepository.save(pricelist);
        }
      }
  
      await this.vehicleModelsRepository.save(vehicleModel);
  
      return vehicleModel;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  
  async createVehicleModel(
    id_type: string,
    name: string,
    price: number,
    year: string,
    req: any,
  ): Promise<any> {
    try {
      if (req['user'].role !== true) {
        throw new UnauthorizedException('Only admin can create vehicle model');
      }

      const vehicleType = await this.vehicleTypesRepository.findOne({
        where: { id_type },
      });
      if (!vehicleType) {
        throw new NotFoundException('Vehicle type not found');
      }

      let vehicleYear = await this.vehicleYearsRepository.findOne({
        where: { year },
      });
      if (!vehicleYear) {
        vehicleYear = this.vehicleYearsRepository.create({ year });
        await this.vehicleYearsRepository.save(vehicleYear);
      }

      const vehicleModel = this.vehicleModelsRepository.create({
        name,
        id_type: vehicleType,
      });
      const newVehicleModel = await this.vehicleModelsRepository.save(
        vehicleModel,
      );

      const pricelist = this.pricelistRepository.create({
        price,
        id_year: vehicleYear,
        id_model: newVehicleModel,
      });
      await this.pricelistRepository.save(pricelist);

      return newVehicleModel;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
