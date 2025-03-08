import { Module } from '@nestjs/common';
import { FeeCollectorService } from './feecollector.service';

@Module({
  providers: [FeeCollectorService],
  exports: [FeeCollectorService],
})
export class FeeCollectorModule {}
