import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Viewer } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { generateCustomId } from 'src/utils/utils';

@Injectable()
export class ViewerService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(ViewerService.name);

  async get(payload: Prisma.ViewerWhereInput): Promise<Viewer | null> {
    try {
      return await this.prismaService.viewer.findFirst({
        where: payload,
        include: {
          bio: true,
        },
      });
    } catch (error) {
      this.logger.error('Error in getViewer', error);
      throw error;
    }
  }

  async create(payload: Prisma.ViewerCreateInput): Promise<Viewer> {
    try {
      return await this.prismaService.viewer.create({
        data: {
          ...payload,
          id: generateCustomId('vwr'),
        },
      });
    } catch (error) {
      this.logger.error('Error in createViewer', error);
      throw error;
    }
  }
}
