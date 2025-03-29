import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CoingeckoService } from './coingecko.service';
import { of } from 'rxjs';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';

describe('CoingeckoService', () => {
  let service: CoingeckoService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoingeckoService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CoingeckoService>(CoingeckoService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return coin price on success', async () => {
    const mockResponse: AxiosResponse = {
      data: { bitcoin: { usd: 50000 } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    };
    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse));

    const price = await service.getCoinPrice('bitcoin');
    expect(price).toBe(50000);
  });

  it('should return -1 on error', async () => {
    jest.spyOn(httpService, 'get').mockReturnValueOnce(
      of({
        data: {
          bitcoin: { usd: -1 },
        },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {
          headers: {} as AxiosRequestHeaders,
        },
      }),
    );

    const price = await service.getCoinPrice('bitcoin');
    expect(price).toBe(-1);
  });
});
