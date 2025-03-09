import { Module } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { TokenService } from 'src/token/token.service';
import { StreamerService } from 'src/streamer/streamer.service';
import { FeeCollectorService } from 'src/feecollector/feecollector.service';
import { ViewerService } from 'src/streamer/viewer.service';
import { SupportService } from 'src/support/support.service';
import { CoingeckoModule } from 'src/coingecko/coingecko.module';
import { TopSupportService } from 'src/top/topsupport.service';
import { TopSupporterService } from 'src/top/topsupporter.service';
import { ListenerController } from './listener.controller';
import { ChainService } from 'src/chain/chain.service';

@Module({
  providers: [
    ListenerService,
    TokenService,
    StreamerService,
    FeeCollectorService,
    ViewerService,
    SupportService,
    TopSupportService,
    TopSupporterService,
    ChainService,
  ],
  exports: [ListenerService],
  imports: [CoingeckoModule],
  controllers: [ListenerController],
})
export class ListenerModule {}
