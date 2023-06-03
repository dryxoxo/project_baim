import { Test, TestingModule } from '@nestjs/testing';
import { VehicleYearsController } from './vehicle-years.controller';

describe('VehicleYearsController', () => {
  let controller: VehicleYearsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleYearsController],
    }).compile();

    controller = module.get<VehicleYearsController>(VehicleYearsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
