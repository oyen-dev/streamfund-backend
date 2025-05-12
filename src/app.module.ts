import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user/user.module';
import { SupportModule } from './support/support.module';
import { ListenerModule } from './listener/listener.module';
import { FeeCollectorModule } from './feecollector/feecollector.module';
import { CoingeckoModule } from './coingecko/coingecko.module';
import { TopModule } from './top/top.module';
import { ChainModule } from './chain/chain.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    TokenModule,
    UserModule,
    SupportModule,
    ListenerModule,
    FeeCollectorModule,
    CoingeckoModule,
    TopModule,
    ChainModule,
    FilesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
