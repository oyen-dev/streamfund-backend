import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, of } from 'rxjs';
import { AxiosError } from 'axios';

type CoinPrice = {
  [key: string]: {
    usd: number;
  };
};

@Injectable()
export class CoingeckoService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(CoingeckoService.name);

  async getCoinPrice(coin_id: string): Promise<number> {
    this.logger.log(`Getting price for ${coin_id}`);
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

    return data[coin_id]?.usd || -1;
  }

  async getCoinPriceWithRetry(coin_id: string, retry = 3): Promise<number> {
    let price = -1;
    for (let i = 0; i < retry; i++) {
      price = await this.getCoinPrice(coin_id);
      if (price !== -1) {
        break;
      }
    }
    return price;
  }
}
