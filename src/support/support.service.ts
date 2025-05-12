import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Support, TopSupport } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateSupportDTO,
  QuerySupportDTO,
  QuerySupportResultDTO,
} from './dto/support.dto';
import { generateCustomId } from 'src/utils/utils';
import { STREAMFUND_FEES } from 'src/utils/constant';

@Injectable()
export class SupportService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(SupportService.name);

  async submitSupport(payload: CreateSupportDTO): Promise<Support> {
    try {
      const {
        data,
        hash,
        usd_amount,
        token_amount,
        collector_id,
        viewer_id,
        streamer_id,
        token_id,
        top_support_id,
        top_supporter_id,
      } = payload;
      const feeShared = (usd_amount * STREAMFUND_FEES) / 10_000;
      const [support, , , , ,] = await this.prismaService.$transaction([
        this.prismaService.support.create({
          data: {
            id: generateCustomId('spt'),
            data,
            hash,
            usd_amount,
            token_amount,
            token_id,
            fee_collector_id: collector_id,
            from_id: viewer_id,
            to_id: streamer_id,
          },
        }),
        this.prismaService.feeCollector.update({
          data: {
            usd_total: {
              increment: feeShared,
            },
          },
          where: {
            id: collector_id,
          },
        }),
        this.prismaService.user.update({
          data: {
            usd_total_given: {
              increment: usd_amount,
            },
          },
          where: {
            id: viewer_id,
          },
        }),
        this.prismaService.user.update({
          data: {
            usd_total_receive: {
              increment: usd_amount,
            },
          },
          where: {
            id: streamer_id,
          },
        }),
        this.prismaService.topSupport.update({
          data: {
            value: {
              increment: usd_amount,
            },
            count: {
              increment: 1,
            },
          },
          where: {
            id: top_support_id,
          },
        }),
        this.prismaService.topSupporter.update({
          data: {
            value: {
              increment: usd_amount,
            },
            count: {
              increment: 1,
            },
          },
          where: {
            id: top_supporter_id,
          },
        }),
      ]);

      return support;
    } catch (error) {
      this.logger.error('Error in submitSupport', error);
      throw error;
    }
  }

  async createTopSupport(
    streamerId: string,
    viewerId: string,
  ): Promise<TopSupport> {
    try {
      return await this.prismaService.topSupport.create({
        data: {
          id: generateCustomId('spt'),
          count: 0,
          value: 0,
          streamer_id: streamerId,
          viewer_id: viewerId,
        },
      });
    } catch (error) {
      this.logger.error('Error in createTopSupport', error);
      throw error;
    }
  }

  async createTopSupporter(
    streamerId: string,
    viewerId: string,
  ): Promise<TopSupport> {
    try {
      return await this.prismaService.topSupporter.create({
        data: {
          id: generateCustomId('tsr'),
          count: 0,
          value: 0,
          streamer_id: streamerId,
          viewer_id: viewerId,
        },
      });
    } catch (error) {
      this.logger.error('Error in createTopSupporter', error);
      throw error;
    }
  }

  async get(payload: Prisma.SupportWhereInput): Promise<Support | null> {
    try {
      return await this.prismaService.support.findFirst({
        where: payload,
      });
    } catch (error) {
      this.logger.error('Error in getSupport', error);
      throw error;
    }
  }

  async query(
    query: QuerySupportDTO,
    opt?: Prisma.SupportWhereInput,
  ): Promise<QuerySupportResultDTO> {
    try {
      const { limit, page, q } = query;
      const whereQuery: Prisma.SupportWhereInput = {
        OR: [
          {
            hash: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            data: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
      };

      if (opt) {
        if (opt.token_id) {
          whereQuery.token_id = opt.token_id;
        }
        if (opt.from_id) {
          whereQuery.from_id = opt.from_id;
        }
        if (opt.to_id) {
          whereQuery.to_id = opt.to_id;
        }
      }

      const [supports, count] = await this.prismaService.$transaction([
        this.prismaService.support.findMany({
          where: whereQuery,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.support.count({
          where: whereQuery,
        }),
      ]);

      return {
        supports,
        count,
      };
    } catch (error) {
      this.logger.error('Error in querySupport', error);
      throw error;
    }
  }

  async create(paylod: Prisma.SupportCreateInput): Promise<Support> {
    try {
      return await this.prismaService.support.create({
        data: {
          ...paylod,
          id: generateCustomId('spt'),
        },
      });
    } catch (error) {
      this.logger.error('Error in createSupport', error);
      throw error;
    }
  }

  async delete(id: string): Promise<Support> {
    try {
      return await this.prismaService.support.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Error in deleteSupport', error);
      throw error;
    }
  }

  async update(
    id: string,
    payload: Prisma.SupportUpdateInput,
  ): Promise<Support> {
    try {
      return await this.prismaService.support.update({
        where: {
          id,
        },
        data: payload,
      });
    } catch (error) {
      this.logger.error('Error in updateSupport', error);
      throw error;
    }
  }
}
