import { Module } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { TokenService } from 'src/token/token.service';

@Module({
  providers: [ListenerService, TokenService],
  exports: [ListenerService],
})
export class ListenerModule {}
