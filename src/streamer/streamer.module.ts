import { Module } from '@nestjs/common';
import { StreamerController } from './streamer.controller';
import { StreamerService } from './streamer.service';

@Module({
  providers: [StreamerService],
  exports: [StreamerService],
  controllers: [StreamerController],
})
export class StreamerModule {}
