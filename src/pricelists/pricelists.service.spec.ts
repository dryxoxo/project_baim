import { Test, TestingModule } from '@nestjs/testing';
import { PricelistsService } from './pricelists.service';

describe('PricelistsService', () => {
  let service: PricelistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricelistsService],
    }).compile();

    service = module.get<PricelistsService>(PricelistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
