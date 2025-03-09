import { Module } from '@nestjs/common';
import { ChainService } from './chain.service';
import { ChainController } from './chain.controller';

@Module({
  providers: [ChainService],
  exports: [ChainService],
  controllers: [ChainController],
})
export class ChainModule {}
