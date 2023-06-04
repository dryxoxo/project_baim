import { Controller } from '@nestjs/common';
import { PricelistsService } from './pricelists.service';
@Controller('pricelists')
export class PricelistsController {
    constructor(
        private readonly pricelistsService: PricelistsService,
    ) {}
}
