import { Test, TestingModule } from '@nestjs/testing';
import { ChainController } from './chain.controller';
import { ChainService } from './chain.service';
import { QueryChainDTO, QueryChainResultDTO } from './dto/chain.dto';
import { HttpStatus } from '@nestjs/common';
import { Chain } from '@prisma/client';

describe('ChainController', () => {
  let chainController: ChainController;
  let chainService: ChainService;

  beforeEach(async () => {
    const mockChainService = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChainController],
      providers: [
        {
          provide: ChainService,
          useValue: mockChainService,
        },
      ],
    }).compile();

    chainController = module.get<ChainController>(ChainController);
    chainService = module.get<ChainService>(ChainService);
  });

  it('should query chains successfully', async () => {
    const query: QueryChainDTO = { limit: 10, page: 1, q: 'test' };
    const chain: Chain = {
      id: 'chain-1',
      name: 'test',
      chain_id: 1,
      block_explorer_url: 'test.com',
      image: 'test.png',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
    const mockResponse: QueryChainResultDTO = {
      count: 1,
      chains: [chain],
    };

    jest.spyOn(chainService, 'query').mockResolvedValue(mockResponse);

    const result = await chainController.query(query);

    expect(result).toEqual({
      success: true,
      message: 'Chain queried successfully',
      metadata: {
        page: 1,
        limit: 10,
        total: 1,
      },
      data: {
        chains: mockResponse.chains,
      },
      status_code: HttpStatus.OK,
    });
  });
});
