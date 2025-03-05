import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Revenue } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { generateCustomId } from '../utils/utils';
import { QueryRevenueDTO, QueryRevenueResultDTO } from './dto/revenue.dto';

@Injectable()
export class RevenueService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(RevenueService.name);

  async get(payload: Prisma.RevenueWhereInput): Promise<Revenue | null> {
    try {
      return await this.prismaService.revenue.findFirst({
        where: payload,
      });
    } catch (error) {
      this.logger.error('Error in getRevenueAccount: ' + error);
      throw error;
    }
  }

  async query(
    query: QueryRevenueDTO,
    opt?: Prisma.RevenueWhereInput,
  ): Promise<QueryRevenueResultDTO> {
    try {
      const { limit, page, q } = query;
      const whereQuery: Partial<Prisma.RevenueWhereInput> = {
        OR: [
          {
            id: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            address: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
        deletedAt: null,
      };

      if (opt) {
        if (opt.chain) {
          whereQuery.chain = opt.chain;
        }
      }

      const [revenues, count] = await this.prismaService.$transaction([
        this.prismaService.revenue.findMany({
          where: whereQuery,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            usd_total: 'asc',
          },
        }),
        this.prismaService.revenue.count({
          where: whereQuery,
        }),
      ]);

      return {
        revenues,
        count,
      };
    } catch (error) {
      this.logger.error('Error in queryRevenueAccount: ' + error);
      throw error;
    }
  }

  async create(payload: Prisma.RevenueCreateInput): Promise<Revenue> {
    try {
      return await this.prismaService.revenue.create({
        data: {
          ...payload,
          id: generateCustomId('revenue'),
        },
      });
    } catch (error) {
      this.logger.error('Error in createNewRevenueAccount: ' + error);
      throw error;
    }
  }

  async delete(
    id: string,
    payload: Prisma.RevenueWhereInput,
  ): Promise<Revenue> {
    try {
      return await this.prismaService.revenue.update({
        where: {
          ...payload,
          id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Error in deleteRevenueAccount: ' + error);
      throw error;
    }
  }

  async update(
    id: string,
    payload: Prisma.RevenueUpdateInput,
  ): Promise<Revenue> {
    try {
      return await this.prismaService.revenue.update({
        where: {
          id,
        },
        data: {
          ...payload,
        },
      });
    } catch (error) {
      this.logger.error('Error in updateRevenueAccount: ' + error);
      throw error;
    }
  }
}
