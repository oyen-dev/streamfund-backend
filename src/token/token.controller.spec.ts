import { Test, TestingModule } from '@nestjs/testing';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { QueryTokenDTO } from './dto/token.dto';
import { Token } from '@prisma/client';

describe('TokenController', () => {
  let controller: TokenController;
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        {
          provide: TokenService,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TokenController>(TokenController);
    service = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should query tokens', async () => {
    const query: QueryTokenDTO = {
      limit: 10,
      page: 1,
      q: 'test',
      chain: 1,
    };
    const tokens: Token[] = [
      {
        id: '1',
        address: '0x1',
        chain: 1,
        decimal: 18,
        name: 'test',
        image: 'test.png',
        coin_gecko_id: 'test',
        symbol: 'test',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: '2',
        address: '0x2',
        chain: 1,
        decimal: 18,
        name: 'test',
        image: 'test.png',
        coin_gecko_id: 'test',
        symbol: 'test',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ];

    jest.spyOn(service, 'query').mockResolvedValue({
      count: tokens.length,
      tokens,
    });

    const result = await controller.query(query);
    expect(result.data?.tokens).toEqual(tokens);
    expect(result.metadata?.total).toEqual(tokens.length);
  });
});
