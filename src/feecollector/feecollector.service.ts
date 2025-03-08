import { Injectable, Logger } from '@nestjs/common';
import { Prisma, FeeCollector } from '@prisma/client';
import {
  QueryFeeCollectorDTO,
  QueryFeeCollectorResultDTO,
} from './dto/feecollector.dto';
import { PrismaService } from 'src/prisma.service';
import { generateCustomId } from 'src/utils/utils';

@Injectable()
export class FeeCollectorService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(FeeCollectorService.name);

  async get(
    payload: Prisma.FeeCollectorWhereInput,
  ): Promise<FeeCollector | null> {
    try {
      return await this.prismaService.feeCollector.findFirst({
        where: payload,
      });
    } catch (error) {
      this.logger.error('Error in getFeeCollectorAccount: ' + error);
      throw error;
    }
  }

  async query(
    query: QueryFeeCollectorDTO,
    opt?: Prisma.FeeCollectorWhereInput,
  ): Promise<QueryFeeCollectorResultDTO> {
    try {
      const { limit, page, q } = query;
      const whereQuery: Partial<Prisma.FeeCollectorWhereInput> = {
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

      const [collectors, count] = await this.prismaService.$transaction([
        this.prismaService.feeCollector.findMany({
          where: whereQuery,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            usd_total: 'asc',
          },
        }),
        this.prismaService.feeCollector.count({
          where: whereQuery,
        }),
      ]);

      return {
        collectors,
        count,
      };
    } catch (error) {
      this.logger.error('Error in queryFeeCollectorAccount: ' + error);
      throw error;
    }
  }

  async create(payload: Prisma.FeeCollectorCreateInput): Promise<FeeCollector> {
    try {
      return await this.prismaService.feeCollector.create({
        data: {
          ...payload,
          id: generateCustomId('fcr'),
        },
      });
    } catch (error) {
      this.logger.error('Error in createNewFeeCollectorAccount: ' + error);
      throw error;
    }
  }

  async delete(id: string): Promise<FeeCollector> {
    try {
      return await this.prismaService.feeCollector.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Error in deleteFeeCollectorAccount: ' + error);
      throw error;
    }
  }

  async update(
    id: string,
    payload: Prisma.FeeCollectorUpdateInput,
  ): Promise<FeeCollector> {
    try {
      return await this.prismaService.feeCollector.update({
        where: {
          id,
        },
        data: payload,
      });
    } catch (error) {
      this.logger.error('Error in updateFeeCollectorAccount: ' + error);
      throw error;
    }
  }
}
