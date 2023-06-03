import { Test, TestingModule } from '@nestjs/testing';
import { PricelistsController } from './pricelists.controller';

describe('PricelistsController', () => {
  let controller: PricelistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricelistsController],
    }).compile();

    controller = module.get<PricelistsController>(PricelistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
