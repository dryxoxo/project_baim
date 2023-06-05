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
import { CreateVehicleDto } from './dto/createVehicle.dto';
import { Request } from 'express';

@Injectable()
export class VehicleService {
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

  async create(createVehicleDto: CreateVehicleDto, req: Request): Promise<any> {
    try {
      const { brandName, typeName, modelName, year, price } = createVehicleDto;
      if (req['user'].role !== true) {
        throw new UnauthorizedException('Only admin can create pricelist');
      }

      let vehicleBrand = await this.vehicleBrandsRepository.findOne({
        where: { name: brandName },
      });
      if (!vehicleBrand) {
        vehicleBrand = new vehicle_brands();
        vehicleBrand.name = brandName;
        vehicleBrand = await this.vehicleBrandsRepository.save(vehicleBrand);
      }

      let vehicleType = await this.vehicleTypesRepository.findOne({
        where: { name: typeName, id_brand: Equal(vehicleBrand.id_brand) },
      });
      if (!vehicleType) {
        vehicleType = new vehicle_types();
        vehicleType.name = typeName;
        vehicleType.id_brand = vehicleBrand;
        vehicleType = await this.vehicleTypesRepository.save(vehicleType);
      }

      let vehicleModel = await this.vehicleModelsRepository.findOne({
        where: { name: modelName, id_type: Equal(vehicleType.id_type) },
      });
      if (!vehicleModel) {
        vehicleModel = new vehicle_models();
        vehicleModel.name = modelName;
        vehicleModel.id_type = vehicleType;
        vehicleModel = await this.vehicleModelsRepository.save(vehicleModel);
      }

      let vehicleYear = await this.vehicleYearsRepository.findOne({
        where: { year },
      });
      if (!vehicleYear) {
        vehicleYear = new vehicle_years();
        vehicleYear.year = year;
        vehicleYear = await this.vehicleYearsRepository.save(vehicleYear);
      }

      const newPricelist = new pricelist();
      newPricelist.price = price;
      newPricelist.id_year = vehicleYear;
      newPricelist.id_model = vehicleModel;
      await this.pricelistRepository.save(newPricelist);

      return { message: 'Success created' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException("Can't create data");
      } else if (error instanceof ConflictException) {
        throw new ConflictException("Can't create data");
      } else {
        throw new Error('Internal server error');
      }
    }
  }

  async findAll(page: number, limit: number): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const [pricelists, total] = await this.pricelistRepository.findAndCount({
        relations: [
          'id_model',
          'id_model.id_type',
          'id_model.id_type.id_brand',
          'id_year',
        ],
        take: limit,
        skip: skip,
      });

      const formattedPricelists = pricelists.map((pricelist) => ({
        year: pricelist.id_year.year,
        idBrand: pricelist.id_model.id_type.id_brand.id_brand,
        brandName: pricelist.id_model.id_type.id_brand.name,
        createdAt: pricelist.created_at,
        updatedAt: pricelist.updated_at,
        model: {
          id_model: pricelist.id_model.id_model,
          modelName: pricelist.id_model.name,
          createdAt: pricelist.id_model.created_at,
          updatedAt: pricelist.id_model.updated_at,
          type: {
            id_type: pricelist.id_model.id_type.id_type,
            typeName: pricelist.id_model.id_type.name,
            price: pricelist.price,
            createdAt: pricelist.id_model.id_type.created_at,
            updatedAt: pricelist.id_model.id_type.updated_at,
          },
        },
      }));

      const totalPages = Math.ceil(total / limit);
      const baseUrl = '/vehicle';
      const previous = page > 1 ? page - 1 : null;
      const next = page < totalPages ? page + 1 : null;
      const nextPageUrl = next ? `${baseUrl}?page=${next}` : null;
      const previousPageUrl = previous ? `${baseUrl}?page=${previous}` : null;

      return {
        page,
        limit,
        total,
        previous: previousPageUrl,
        next: nextPageUrl,
        data: formattedPricelists,
      };
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async findOne(params: {
    nameBrand?: string;
    nameModel?: string;
    nameType?: string;
    years?: string;
    price?: number;
    page?: number;
    limit?: number;
  }): Promise<any> {
    try {
      const {
        nameBrand,
        nameModel,
        nameType,
        years,
        price,
        page = 1,
        limit = 10,
      } = params;

      const pricelists = await this.pricelistRepository.find({
        relations: [
          'id_model',
          'id_model.id_type',
          'id_model.id_type.id_brand',
          'id_year',
        ],
      });

      let filteredPricelists = pricelists;

      if (nameBrand) {
        filteredPricelists = filteredPricelists.filter(
          (pricelist) => pricelist.id_model.id_type.id_brand.name === nameBrand,
        );
      }

      if (nameModel) {
        filteredPricelists = filteredPricelists.filter(
          (pricelist) => pricelist.id_model.name === nameModel,
        );
      }

      if (nameType) {
        filteredPricelists = filteredPricelists.filter(
          (pricelist) => pricelist.id_model.id_type.name === nameType,
        );
      }

      if (years) {
        const yearArray = years.split(',').map((year) => year.trim());
        filteredPricelists = filteredPricelists.filter((pricelist) =>
          yearArray.includes(pricelist.id_year.year),
        );
      }

      if (price) {
        filteredPricelists = filteredPricelists.filter(
          (pricelist) => pricelist.price <= price,
        );
      }

      if (filteredPricelists.length === 0) {
        throw new NotFoundException('Data not found');
      }

      const total = filteredPricelists.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPricelists = filteredPricelists.slice(
        startIndex,
        endIndex,
      );

      const formattedPricelists = paginatedPricelists.map((pricelist) => ({
        year: pricelist.id_year.year,
        brandName: pricelist.id_model.id_type.id_brand.name,
        modelName: pricelist.id_model.name,
        typeName: pricelist.id_model.id_type.name,
        price: pricelist.price,
        idBrand: pricelist.id_model.id_type.id_brand.id_brand,
        idType: pricelist.id_model.id_type.id_type,
        idModel: pricelist.id_model.id_model,
      }));

      const baseUrl = '/vehicle/search/';
      const previous = page > 1 ? page - 1 : null;
      const next = page < totalPages ? page + 1 : null;
      const nextPageUrl = next ? `${baseUrl}?page=${next}` : null;
      const previousPageUrl = previous ? `${baseUrl}?page=${previous}` : null;

      return {
        page,
        limit,
        total,
        previous: previousPageUrl,
        next: nextPageUrl,
        data: formattedPricelists,
      };
    } catch (error) {
      throw new InternalServerErrorException('Cannot process the request');
    }
  }

  // async delete(id_brand: string, req: Request): Promise<any> {
  //   try {
  //     if (req['user'].role !== true) {
  //       throw new UnauthorizedException('Only admin can deletes brands');
  //     }
  //     const brand = await this.vehicleBrandsRepository.findOne({
  //       where: { id_brand },
  //     });
  //     if (!brand) {
  //       throw new NotFoundException('Brand not found');
  //     }
  //     await this.vehicleBrandsRepository.delete({ id_brand });
  //     return { message: 'Brand deleted' };
  //   } catch (error) {
  //     throw new InternalServerErrorException('Cannot process the request');
  //   }
  // }
}
