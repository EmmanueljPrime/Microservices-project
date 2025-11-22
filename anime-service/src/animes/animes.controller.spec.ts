import { Test, TestingModule } from '@nestjs/testing';
import { AnimesController } from './animes.controller';

describe('AnimesController', () => {
  let controller: AnimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimesController],
    }).compile();

    controller = module.get<AnimesController>(AnimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
