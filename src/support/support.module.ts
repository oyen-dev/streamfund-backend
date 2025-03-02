import { Module } from '@nestjs/common';
import { SupportService } from './support.service';

@Module({
  providers: [SupportService]
})
export class SupportModule {}
