import { Module } from '@nestjs/common';
import { StreamerService } from './streamer.service';

@Module({
  providers: [StreamerService],
  exports: [StreamerService],
})
export class StreamerModule {}
