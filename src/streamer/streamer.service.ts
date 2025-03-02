import { Injectable, Logger } from '@nestjs/common';
import { Streamer } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StreamerService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(StreamerService.name);

  async getStreamerByStreamKey(stream_key: string): Promise<Streamer | null> {
    try {
      const streamer = await this.prismaService.streamer.findFirst({
        where: {
          stream_key,
        },
        include: {
          bio: true,
          configuration: true,
        },
      });

      return streamer;
    } catch (error) {
      this.logger.error('Error in getStreamerByStreamKey', error);
      throw error;
    }
  }

  async getStreamerByAddress(address: string): Promise<Streamer | null> {
    try {
      const streamer = await this.prismaService.streamer.findFirst({
        where: {
          address,
        },
        include: {
          bio: true,
          configuration: true,
        },
      });

      return streamer;
    } catch (error) {
      this.logger.error('Error in getStreamerByAddress', error);
      throw error;
    }
  }

  async getStreamerByUsername(username: string): Promise<Streamer | null> {
    try {
      const streamer = await this.prismaService.streamer.findFirst({
        where: {
          bio: {
            username,
          },
        },
        include: {
          bio: true,
          configuration: true,
        },
      });

      return streamer;
    } catch (error) {
      this.logger.error('Error in getStreamerByUsername', error);
      throw error;
    }
  }
}
