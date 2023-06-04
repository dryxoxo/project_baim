import { Controller } from '@nestjs/common';
import { VehicleBrandsService } from './vehicle-brands.service';
@Controller('vehicle-brands')
export class VehicleBrandsController {
    constructor(
        private readonly vehicleBrandsService: VehicleBrandsService,
    ) {}

}
