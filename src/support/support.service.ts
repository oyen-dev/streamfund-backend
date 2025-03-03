import { Injectable, Logger } from '@nestjs/common';
import { Support, TopSupport } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateSupportDTO } from './dto/support.dto';
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

  async getTokenPrice(address: string, symbol: string): Promise<number> {
    try {
      // Call API to get token price
      console.log(`Getting price for ${symbol} with address ${address}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return 1;
    } catch (error) {
      this.logger.error('Error in getTokenPrice', error);
      throw error;
    }
  }
}
