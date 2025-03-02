import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { PrismaModule } from './prisma.module';
import { StreamerModule } from './streamer/streamer.module';
import { SupportModule } from './support/support.module';
import { ListenerModule } from './listener/listener.module';
import { RevenueModule } from './revenue/revenue.module';

@Module({
  imports: [PrismaModule, TokenModule, StreamerModule, SupportModule, ListenerModule, RevenueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
