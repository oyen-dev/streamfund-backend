import { Module } from '@nestjs/common';
import { TopSupportService } from './topsupport.service';
import { TopSupporterService } from './topsupporter.service';

@Module({
  providers: [TopSupportService, TopSupporterService],
})
export class TopModule {}
