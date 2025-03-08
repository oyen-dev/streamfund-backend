import { Injectable, Logger } from '@nestjs/common';
import { Prisma, TopSupporter } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { generateCustomId } from 'src/utils/utils';

@Injectable()
export class TopSupporterService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(TopSupporterService.name);

  async get(
    payload: Prisma.TopSupporterWhereInput,
  ): Promise<TopSupporter | null> {
    try {
      return await this.prismaService.topSupporter.findFirst({
        where: payload,
      });
    } catch (error) {
      this.logger.error('Error in getTopSupporter', error);
      throw error;
    }
  }

  async create(payload: Prisma.TopSupporterCreateInput): Promise<TopSupporter> {
    try {
      return await this.prismaService.topSupporter.create({
        data: {
          ...payload,
          id: generateCustomId('tsr'),
        },
      });
    } catch (error) {
      this.logger.error('Error in createTopSupporter', error);
      throw error;
    }
  }
}
