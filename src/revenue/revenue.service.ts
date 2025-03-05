import { Injectable, Logger } from '@nestjs/common';
import { Revenue } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { generateCustomId } from '../utils/utils';

@Injectable()
export class RevenueService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(RevenueService.name);

  async createNewRevenueAccount(
    address: string,
    chain: number,
  ): Promise<Revenue> {
    try {
      return await this.prismaService.revenue.create({
        data: {
          id: generateCustomId('rev'),
          address,
          chain,
          usd_total: 0,
        },
      });
    } catch (error) {
      this.logger.error('Error in createNewRevenueAccount: ' + error);
      throw error;
    }
  }

  async getRevenueAccount(
    address: string,
    chain: number,
  ): Promise<Revenue | null> {
    try {
      return await this.prismaService.revenue.findFirst({
        where: {
          address,
          chain,
        },
      });
    } catch (error) {
      this.logger.error('Error in getRevenueAccount: ' + error);
      throw error;
    }
  }
}
