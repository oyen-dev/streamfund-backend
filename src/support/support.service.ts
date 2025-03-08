import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Support, TopSupport } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateSupportDTO,
  QuerySupportDTO,
  QuerySupportResultDTO,
} from './dto/support.dto';
import { generateCustomId } from 'src/utils/utils';

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
        revenueId,
        streamerId,
        tokenId,
        viewerId,
        topSupportId,
        topSupporterId,
      } = payload;
      const [support, , ,] = await this.prismaService.$transaction([
        this.prismaService.support.create({
          data: {
            id: generateCustomId('support'),
            data,
            hash,
            usd_amount,
            fromId: viewerId,
            toId: streamerId,
            tokenId,
            revenueId,
          },
        }),
        this.prismaService.revenue.update({
          data: {
            usd_total: {
              increment: usd_amount,
            },
          },
          where: {
            id: revenueId,
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
            id: topSupportId,
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
            id: topSupporterId,
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
          id: generateCustomId('support'),
          count: 0,
          value: 0,
          streamerId,
          viewerId,
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
          id: generateCustomId('supporter'),
          count: 0,
          value: 0,
          streamerId,
          viewerId,
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
              string_contains: q,
              mode: 'insensitive',
            },
          },
        ],
      };

      if (opt) {
        if (opt.tokenId) {
          whereQuery.tokenId = opt.tokenId;
        }
        if (opt.fromId) {
          whereQuery.fromId = opt.fromId;
        }
        if (opt.toId) {
          whereQuery.toId = opt.toId;
        }
      }

      const [supports, count] = await this.prismaService.$transaction([
        this.prismaService.support.findMany({
          where: whereQuery,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            createdAt: 'desc',
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
        data: paylod,
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
          deletedAt: new Date(),
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
