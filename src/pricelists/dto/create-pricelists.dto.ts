import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreatePricelistDto {
  @IsUUID()
  @IsNotEmpty()
  id_year: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsUUID()
  @IsNotEmpty()
  id_model: string;
}
