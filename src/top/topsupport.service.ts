import { Injectable, Logger } from '@nestjs/common';
import { Prisma, TopSupport } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { generateCustomId } from 'src/utils/utils';

@Injectable()
export class TopSupportService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(TopSupportService.name);

  async get(payload: Prisma.TopSupportWhereInput): Promise<TopSupport | null> {
    try {
      return await this.prismaService.topSupport.findFirst({
        where: payload,
      });
    } catch (error) {
      this.logger.error('Error in getTopSupport', error);
      throw error;
    }
  }

  async create(payload: Prisma.TopSupportCreateInput): Promise<TopSupport> {
    try {
      return await this.prismaService.topSupport.create({
        data: {
          ...payload,
          id: generateCustomId('tst'),
        },
      });
    } catch (error) {
      this.logger.error('Error in createTopSupport', error);
      throw error;
    }
  }
}
