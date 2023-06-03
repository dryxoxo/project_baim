import { Test, TestingModule } from '@nestjs/testing';
import { VehicleYearsService } from './vehicle-years.service';

describe('VehicleYearsService', () => {
  let service: VehicleYearsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleYearsService],
    }).compile();

    service = module.get<VehicleYearsService>(VehicleYearsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
