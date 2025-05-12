import { Module } from '@nestjs/common';
import { StreamerController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [StreamerController],
})
export class StreamerModule {}
