import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { CoingeckoService } from 'src/coingecko/coingecko.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [TokenService, CoingeckoService],
  imports: [HttpModule],
  exports: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
