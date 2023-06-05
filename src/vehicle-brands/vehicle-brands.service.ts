import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { vehicle_brands } from '../vehicle-brands/entity/vehicle-brands.entity';
import { vehicle_types } from '../vehicle-types/entity/vehicle-types.entity';
import { vehicle_models } from '../vehicle-models/entity/vehicle-models.entity';
import { vehicle_years } from '../vehicle-years/entity/vehicle-years.entity';
import { pricelist } from '../pricelists/entity/pricelists.entity';
import { Repository, Equal } from 'typeorm';
import { Request } from 'express';
@Injectable()
export class VehicleBrandsService {
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

  async update(id_brand: string, name: string, req: Request): Promise<any> {
    try {
      if (req['user'].role !== true) {
        throw new UnauthorizedException('Only admin can update vehicle brand');
      }
      const vehicleBrand = await this.vehicleBrandsRepository.findOne({
        where: { id_brand },
      });
      if (!vehicleBrand) {
        throw new NotFoundException('Vehicle brand not found');
      }
      vehicleBrand.name = name;
      await this.vehicleBrandsRepository.save(vehicleBrand);
      return {
        message: 'Vehicle brand updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // async delete(id_brand: string, req: Request): Promise<any> {
  //   if (req['user'].role !== true) {
  //     throw new UnauthorizedException('Only admin can delete vehicle brand');
  //   }
  
  //   const pricelists = await this.pricelistRepository
  //     .createQueryBuilder('pricelist')
  //     .leftJoin('pricelist.id_model', 'model')
  //     .leftJoin('model.id_type', 'type')
  //     .leftJoin('type.id_brand', 'brand')
  //     .where('brand.id_brand = :id', { id: id_brand }) // Use named parameter :id
  //     .getMany();
  
  //   if (!pricelists || pricelists.length === 0) {
  //     throw new NotFoundException('Brand not found');
  //   }
  
  //   const modelIds = pricelists.map(pricelist => pricelist.id_model.id_model);
  //   const typeIds = pricelists.map(pricelist => pricelist.id_model.id_type.id_type);
  
  //   // Menghapus pricelists
  //   await this.pricelistRepository.remove(pricelists);
  
  //   // Menghapus models berdasarkan modelIds
  //   await this.vehicleModelsRepository.delete(modelIds);
  
  //   // Menghapus types berdasarkan typeIds
  //   await this.vehicleTypesRepository.delete(typeIds);
  
  //   // Menghapus brand
  //   await this.vehicleBrandsRepository.delete(id_brand);
  
  //   return {
  //     message: 'Brand and related entities deleted successfully',
  //   };
  // }

  async delete(id_brand: string, req: Request): Promise<any> {
    if (req['user'].role !== true) {
      throw new UnauthorizedException('Only admin can delete vehicle brand');
    }
  
    const pricelists = await this.pricelistRepository
      .createQueryBuilder('pricelist')
      .leftJoin('pricelist.id_model', 'model')
      .leftJoin('model.id_type', 'type')
      .leftJoin('type.id_brand', 'brand')
      .where('brand.id_brand = :id', { id: id_brand }) // Gunakan named parameter :id
      .getMany();
  
    if (!pricelists || pricelists.length === 0) {
      throw new NotFoundException('Brand not found');
    }
  
    const modelIds = pricelists.map(pricelist => pricelist.id_model?.id_model);
    const typeIds = pricelists.map(pricelist => pricelist.id_model?.id_type?.id_type);
  
    // Menghapus pricelists
    await this.pricelistRepository.remove(pricelists);
  
    // Menghapus models berdasarkan modelIds
    if (modelIds.length > 0) {
      await this.vehicleModelsRepository.delete(modelIds);
    }
  
    // Menghapus types berdasarkan typeIds
    if (typeIds.length > 0) {
      await this.vehicleTypesRepository.delete(typeIds);
    }
  
    // Menghapus brand
    await this.vehicleBrandsRepository.delete(id_brand);
  
    return {
      message: 'Brand and related entities deleted successfully',
    };
  }
  
}
