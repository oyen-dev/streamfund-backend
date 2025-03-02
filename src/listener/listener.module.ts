import { Module } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { TokenService } from 'src/token/token.service';
import { StreamerService } from 'src/streamer/streamer.service';
import { RevenueService } from 'src/revenue/revenue.service';

@Module({
  providers: [ListenerService, TokenService, StreamerService, RevenueService],
  exports: [ListenerService],
})
export class ListenerModule {}
