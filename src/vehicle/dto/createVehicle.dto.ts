// create-pricelist.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  brandName: string;

  @IsNotEmpty()
  @IsString()
  typeName: string;

  @IsNotEmpty()
  @IsString()
  modelName: string;

  @IsNotEmpty()
  @IsString()
  year: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}