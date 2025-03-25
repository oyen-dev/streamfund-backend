import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Streamer } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { generateCustomId } from '../utils/utils';
import {
  GetStreamerResultDTO,
  QueryStreamerDTO,
  QueryStreamerResultDTO,
} from './dto/streamer.dto';

@Injectable()
export class StreamerService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(StreamerService.name);

  async get(
    payload: Prisma.StreamerWhereInput,
  ): Promise<GetStreamerResultDTO | null> {
    try {
      return await this.prismaService.streamer.findFirst({
        where: payload,
        include: {
          bio: true,
          configuration: true,
        },
      });
    } catch (error) {
      this.logger.error('Error in getStreamer', error);
      throw error;
    }
  }

  async query(
    query: QueryStreamerDTO,
    opt?: Prisma.StreamerWhereInput,
  ): Promise<QueryStreamerResultDTO> {
    try {
      const { limit, page, q } = query;
      const whereQuery: Prisma.StreamerWhereInput = {
        OR: [
          {
            address: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
        deleted_at: null,
      };

      if (opt) {
        if (opt.bio?.username) {
          whereQuery.bio = {
            username: opt.bio.username,
          };
        }
      }

      const [streamers, count] = await this.prismaService.$transaction([
        this.prismaService.streamer.findMany({
          where: whereQuery,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            usd_total_support: 'desc',
          },
          include: {
            bio: true,
            configuration: true,
          },
        }),
        this.prismaService.streamer.count({
          where: whereQuery,
        }),
      ]);

      return {
        streamers,
        count,
      };
    } catch (error) {
      this.logger.error('Error in queryStreamer', error);
      throw error;
    }
  }

  async create(
    paylod: Prisma.StreamerCreateInput,
  ): Promise<GetStreamerResultDTO> {
    try {
      return await this.prismaService.streamer.create({
        data: {
          ...paylod,
          id: generateCustomId('str'),
        },
        include: {
          bio: true,
          configuration: true,
        },
      });
    } catch (error) {
      this.logger.error('Error in createStreamer', error);
      throw error;
    }
  }

  async delete(id: string): Promise<Streamer> {
    try {
      return await this.prismaService.streamer.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Error in deleteStreamer', error);
      throw error;
    }
  }

  async update(
    id: string,
    payload: Prisma.StreamerUpdateInput,
  ): Promise<Streamer> {
    try {
      return await this.prismaService.streamer.update({
        where: {
          id,
        },
        data: payload,
      });
    } catch (error) {
      this.logger.error('Error in updateStreamer', error);
      throw error;
    }
  }
}
