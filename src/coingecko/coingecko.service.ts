import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, of } from 'rxjs';
import { AxiosError } from 'axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

type CoinPrice = {
  [key: string]: {
    usd: number;
  };
};

@Injectable()
export class CoingeckoService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {}
  private readonly logger = new Logger(CoingeckoService.name);

  async getCoinPrice(coin_id: string): Promise<number> {
    const cachedPrice = await this.cacheManager.get<number>(coin_id);
    if (cachedPrice) {
      return cachedPrice;
    }

    const { data } = await firstValueFrom(
      this.httpService
        .get<CoinPrice>(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coin_id}&vs_currencies=usd`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            return of({ data: { [coin_id]: { usd: -1 } } });
          }),
        ),
    );

    if (data[coin_id]?.usd) {
      await this.cacheManager.set(coin_id, data[coin_id].usd);
    }

    return data[coin_id]?.usd || -1;
  }
}
