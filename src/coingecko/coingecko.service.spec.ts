import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CoingeckoService } from './coingecko.service';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CoingeckoService', () => {
  let service: CoingeckoService;
  let httpService: HttpService;
  let cacheManager: Cache;

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
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CoingeckoService>(CoingeckoService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
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

  it('should return cached price if available', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(50000);
    const price = await service.getCoinPrice('bitcoin');
    expect(price).toBe(50000);
  });

  it('should handle network errors with catchError', async () => {
    const axiosError = {
      response: {
        data: 'API rate limit exceeded',
        status: 429,
      },
      isAxiosError: true,
    } as AxiosError;

    jest
      .spyOn(httpService, 'get')
      .mockReturnValueOnce(throwError(() => axiosError));

    const price = await service.getCoinPrice('bitcoin');
    console.log('price', price);

    expect(price).toBe(-1);
  });
});
